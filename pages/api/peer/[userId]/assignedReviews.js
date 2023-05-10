const db = require("../../../../models/index.js");
const responseHandler = require("../../utils/responseHandler");


export const config = {
    api: {
        bodyParser: false,
    },
}

export default async (req, res) => {
    try {
        switch (req.method) {
            case "GET":
                const { assignmentId, userId } = req.query;
                if (!assignmentId) {
                    throw new Error("Query parameter assignmentId required");
                }
                const params = { assignmentId, userId };

                let peerMatchings = await db.peer_matchings.findAll({ where: params });

                responseHandler.response200(res, peerMatchings);
                break;

            default:
                throw new Error("Invalid HTTP method");
        }
    } catch (err) {
        responseHandler.response400(res, err);
    }
};
