import _ from 'lodash';

const default_peer_load = 3;
const default_grader_load = 10;

var MARKDOWN_LOG_SUCCESS = _.template('Sucess ! Successfully ran matching algorithm');
var MARKDOWN_LOG_FAILURE = _.template('Failure ! <%= details %>');
var MARKDOWN_LOG_NONE_INPUT = _.template('Input Error !! Input Required but not given. ### Graders <%= graders %> ### Peers <%= peers %> ### Submissions <%= submissions>');
var MARKDOWN_LOG_BAD_INPUT = _.template('Input Error <%= details%> ### Graders <%= graders %> ### Peers <%= peers %> ### Submissions <%= submissions %> ### Peerload <%= peerload%> ### Total Grader Load <%= totgraderload%>');

function error_object(markdown_log,args){
	// args is a dicitonary of the formatting parameters
	return {'matching':[],'log':markdown_log(args),'success':False};
}

async function peerMatch(graders=null,peers=null,submissions=null,peerLoad=default_peer_load,graderLoad=default_grader_load){
	// Input format of the arguments for the main function
	// 'graders':[userId,...], (List of the grader userIDs)
	//   'peers':[userId,...], (List of the peer userIds)
	//   'submissions':[(userID,submissionID),....], (list of userID and submissionID pairs)
	//   'peer_load' : int, (number of reviews to assing per peer)
	//   'grader_load' : int, (number of total reviews to assign to TAs)

	// First we generate an array of unique submission IDs
	
	var unique_submissions = new Set(); // Define a set object to hold unique elements
	Array.from(submissions.forEach(submission => unique_submissions.add(submission[1]))); // Add unique submissions to the above set and convert it to an array

	if(!graders || !peers || !submissions){
		return error_object(MARKDOWN_LOG_NONE_INPUT,{'graders':graders,'peers':peers,'submissions':submissions});
	}
	if(unique_submissions.length < graderLoad){
		return error_object(MARKDOWN_LOG_BAD_INPUT,{'details':'grader load must not exceed number of submissions','graders':graders,'peers':peers,'submissions':submissions,'peerload' : peerLoad,'totgraderload' : graderLoad});
	} 
	if(peerLoad - 1 > unique_submissions.length - graderLoad){
		return error_object(MARKDOWN_LOG_BAD_INPUT,{'details':'peer load is too high','graders':graders,'peers':peers,'submissions':submissions,'peerload' : peerLoad,'totgraderload' : graderLoad});
	}

	// We first create a matching for the grader. Randomly sample graderLoad submissions and assign them to the graders
	var graders_assignment = {}; // Initialize the assignments to the graders
	num_graders = graders.length; // The number of graders
	load_per_grader = Math.floor(graderLoad/num_graders) + 1;
	extended_graders = Array(load_per_grader).fill(_.shuffle(graders)).flat(); // Create a list of extended graders
	grader_submissions = (_.shuffle(unique_submissions)).slice(0,graderLoad); // Randomize the unique submissions and consider the first <graderLoad> submissions
	graders.forEach(grader => graders_assignment[grader] = []); // Initialize an empty assignment for each grader
	grader_submissions.forEach(function callback(submissionid,index){graders_assignment[extended_graders[index]].push(submissionid);}); // Match the graders to submissions;

	// Now we assign one review to a peer from grader_submissions. Before that we need to define the excluded ids for each peer. That would be their own id. We need it in the form of a dictionary as that will be passed to peer_assignment

	var excludes = {}; // Initialize an empty dictionary
	submissions.forEach(submission => excludes[submission[0]] = submission[1]);
	
	// We now get an assignment for each peer such that it is a submission that the grader gets. Note that if graderLoad is such that upon not considering that submission, there are less than (peerLoad-1) submissions left, then the next phase of the mathcing will not give peerLoad submissions per peer. Thus in this next phase, the above needs to be taken into account. 

	num_unique_submissions = unique_submissions.length; // The number of unique submissions
	peer_grader_submissions = grader_submissions.slice(0,Math.min(graderLoad,num_unique_submissions-peerLoad+1)); // These submission ids will now be used to perform a matching such that each peer gets one submission from this list

	[peer_grader_assignments,success_peer_grader_assignments] = peer_assignment(peers,peer_grader_submissions,1,excludes);

	if(!success_peer_grader_assignments){
		return errror_object(MARKDOWN_LOG_FAILURE,{'details':'Failed to match peers to grader submissions'});
	}

	// Now the remaining submissions are assigned. Note that the <peer_grader_submissions> will not be in this new list as we only considered unique submission IDs. First we need to verify if there are any remaining submissions.

	var final_peer_matching = {}; // Dictionary to store the final peer matching

	if(num_unique_submissions > Math.min(graderLoad,num_unique_submissions-peerLoad+1)){

		[peer_assignments,success_peer_assignments] = peer_assignment(peers,grader_submissions.slice(Math.min(graderLoad,num_unique_submissions-peerLoad+1)),peerLoad-1,excludes);
	
		if(!success_peer_assignments){
			return error_object(MARKDOWN_LOG_FAILURE,{'details':'Failed to match peers to submissions'});
		}

		peers.forEach(peer => final_peer_matching[peer] = peer_assignments[peer].concat(peer_grader_assignments[peer]));

	}else{
		final_peer_matching = peer_grader_assignments;
	}

	// Need to convert the dictionary matchings into a list of pairs. We write a helper function for the same
	peer_list_matching = convert_dict_to_tuples(final_peer_matching);
	grader_list_matching = convert_dict_to_tuples(graders_assignment);
	combined_matching = peer_list_matching.concat(grader_list_matching);

	return {'matching' : combined_matching, 'peer_matching' : peer_list_matching, 'grader_matching' : grader_list_matching, 'log' : MARKDOWN_LOG_SUCCESS, 'success':true};

}

function convert_dict_to_tuples(matching){
	// Input argument : matching in the format {peerID : [submissionIDs]}
	var list_matching = [];
	matching.forEach(id => matching[id].forEach(subid => list_matching.push([id,subid])));
	return matching;
}

function peer_assignment(peers,submissions,k,excludes,num_tries=10000){
	// Arguments of the function
	// peers : List of the peer userIds
	// submissions : A list of submission IDs
	// k : number of submissions to assing to each peer
	// excludes : {peer id : [excluded submission ids]}
	// Number of iterations to try to find a feasible random matching
	// ***************
	// Output :
	// assignment : A dictionary {peerId : [submission_ids]}
	// success : A boolean variable which stores whether a matching was found succesfully

	num_peers = peers.length; // Number of peers
	num_submissions = submissions.length; // Number of submissions which need to be matched to the peers

	submission_load = Math.floor((num_peers*k)/num_submissions) + 1; // Number of peers per submission. We are rounding up
	
	// Now repeat the peer indices and also repeat the submission indices to match
	peers_rep = Array(k).fill(peers).flat(); // Repeat the list of peer ids
	submissions_rep = Array(submission_load).fill(submissions).flat(); // Repeat the list of submission ids

	// Since we have rounded up, we need to consider a truncation of the repeated submissions list to perform the matching
	submissions_rep = submissions_rep.slice(0,num_peers*k);

	// Now perform the random assignment. The outer for loop is to repeat if an infeasible mathcing is produced
	for(let iter=1;iter <= num_tries;iter++){
		peers_rep_copy = _.shuffle(peers_rep); // Randomly shuffle the peerIDs

		// Now match these peerIDs with the submission ids. We first need to define a dictionary with keys as peer IDs and values as lists. The values will consist of the submission IDs to which the peer is matched
		var assignments = {};		
		peers.forEach(peer => assignments[peer] = []);
		peers_rep_copy.forEach(function callback(value,index){assignments[value].push(submissions_rep[index]);});
	
		// Now verify if this matching is feasible i.e., if there are duplicate assignments or excluded assignments
		var duplicate_exists = []; // Array to store boolean information of whether a duplicate exists in the assignment for each peer
		const duplicate_check = (peer) => duplicates(assignments[peer].concat(excludes[peer]));
		if(peers.some(duplicate_check)){
			continue;
		}

		return [assignments,true];

	}

	return [{},false];
	
}

export function duplicates(tocheck){
	// Function to check if there are any duplicates in a list
	const unique_val = new Set();
	tocheck.forEach(v => unique_val.add(v));
	return tocheck.length != unique_val.size 
}
