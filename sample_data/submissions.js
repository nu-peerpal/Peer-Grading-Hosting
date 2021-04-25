const exampleReview = {"reviewBody":{"scores":[[10,"Enter arbitrary grade."],[10,"Enter arbitrary grade."],[10,"Enter arbitrary grade."]],"comments":""}}
const dataset1 = [
    {
        "submissionType": "online_upload",
        "submission": "https://canvas.northwestern.edu/files/11251661/download?download_frd=1&verifier=TqoLG1Ad5MjwO4HlO4kq0wgqlTf8PPvTAUZrB9U6",
        "assignmentId": "887070",
        "canvasId": 27087775,
        "grade": null,
        "groupId": 169441,
        "submitterId": 82133
    },
    {
        "submissionType": "online_upload",
        "submission": "https://canvas.northwestern.edu/files/11256192/download?download_frd=1&verifier=G9kjCLY6MroBROYXG7T9dl7g4eAyhxJby0j32bVK",
        "assignmentId": "887070",
        "canvasId": 27087778,
        "grade": null,
        "groupId": 169421,
        "submitterId": 96183
    },
    {
        "submissionType": "online_upload",
        "submission": "https://canvas.northwestern.edu/files/11256231/download?download_frd=1&verifier=vhH1MIngUyZKjvy2HHjQTuzQRBLbq7BxiUiPAC0f",
        "assignmentId": "887070",
        "canvasId": 27087779,
        "grade": null,
        "groupId": 169430,
        "submitterId": 96270
    },
    {
        "submissionType": "online_upload",
        "submission": "https://canvas.northwestern.edu/files/11251735/download?download_frd=1&verifier=dKU1PTBVWs32vmFr5XGQtpO9Rv9Xck4rhZxltY7N",
        "assignmentId": "887070",
        "canvasId": 27087780,
        "grade": null,
        "groupId": 169396,
        "submitterId": 96891
    },
    {
        "submissionType": "online_upload",
        "submission": "https://canvas.northwestern.edu/files/11256547/download?download_frd=1&verifier=YJz975BaujXMShMm6u86H1vjcgipm4YrC9uWdlKi",
        "assignmentId": "887070",
        "canvasId": 27087781,
        "grade": null,
        "groupId": 169416,
        "submitterId": 96922
    },
    {
        "submissionType": "online_upload",
        "submission": "https://canvas.northwestern.edu/files/11254990/download?download_frd=1&verifier=btYNUPngXv9Groa0fMhB0ztcSI8eXyxfKyICQsVY",
        "assignmentId": "887070",
        "canvasId": 27087782,
        "grade": null,
        "groupId": 169397,
        "submitterId": 97178
    },
    {
        "submissionType": "online_upload",
        "submission": "https://canvas.northwestern.edu/files/11256213/download?download_frd=1&verifier=hqVOonug3MVzSG0ldrGNUZNeo0dDvW35B9A0rT8k",
        "assignmentId": "887070",
        "canvasId": 27087783,
        "grade": null,
        "groupId": 169395,
        "submitterId": 97825
    },
    {
        "submissionType": "online_upload",
        "submission": "https://canvas.northwestern.edu/files/11256139/download?download_frd=1&verifier=hta7laq517g8FeNebBM5GUXTl6msdZbmBkOo2LPG",
        "assignmentId": "887070",
        "canvasId": 27087784,
        "grade": null,
        "groupId": 169460,
        "submitterId": 100358
    },
    {
        "submissionType": "online_upload",
        "submission": "https://canvas.northwestern.edu/files/11256514/download?download_frd=1&verifier=J0TFeEUt3XqOm6pjJJrqOdCtHUpg1OYIyv99G7HH",
        "assignmentId": "887070",
        "canvasId": 27087785,
        "grade": null,
        "groupId": 169457,
        "submitterId": 101064
    },
    {
        "submissionType": "online_upload",
        "submission": "https://canvas.northwestern.edu/files/11256231/download?download_frd=1&verifier=vhH1MIngUyZKjvy2HHjQTuzQRBLbq7BxiUiPAC0f",
        "assignmentId": "887070",
        "canvasId": 27087779,
        "grade": null,
        "groupId": 169430,
        "submitterId": 114600
    },
    {
        "submissionType": "online_upload",
        "submission": "https://canvas.northwestern.edu/files/11251735/download?download_frd=1&verifier=dKU1PTBVWs32vmFr5XGQtpO9Rv9Xck4rhZxltY7N",
        "assignmentId": "887070",
        "canvasId": 27087780,
        "grade": null,
        "groupId": 169396,
        "submitterId": 114867
    },
    {
        "submissionType": "online_upload",
        "submission": "https://canvas.northwestern.edu/files/11254990/download?download_frd=1&verifier=btYNUPngXv9Groa0fMhB0ztcSI8eXyxfKyICQsVY",
        "assignmentId": "887070",
        "canvasId": 27087782,
        "grade": null,
        "groupId": 169397,
        "submitterId": 115543
    },
    {
        "submissionType": "online_upload",
        "submission": "https://canvas.northwestern.edu/files/11256220/download?download_frd=1&verifier=C0nke4q5At7aUFJWyspxT3M5hjYW6oPnJB8zvGG5",
        "assignmentId": "887070",
        "canvasId": 27087793,
        "grade": null,
        "groupId": 169434,
        "submitterId": 115861
    },
    {
        "submissionType": "online_upload",
        "submission": "https://canvas.northwestern.edu/files/11256192/download?download_frd=1&verifier=G9kjCLY6MroBROYXG7T9dl7g4eAyhxJby0j32bVK",
        "assignmentId": "887070",
        "canvasId": 27087778,
        "grade": null,
        "groupId": 169421,
        "submitterId": 115885
    },
    {
        "submissionType": "online_upload",
        "submission": "https://canvas.northwestern.edu/files/11255656/download?download_frd=1&verifier=bAGtEOPeK3HCkzLuQkIoXc3fKPZUB0CRtm1znkDt",
        "assignmentId": "887070",
        "canvasId": 27087795,
        "grade": null,
        "groupId": 169432,
        "submitterId": 116343
    },
    {
        "submissionType": "online_upload",
        "submission": "https://canvas.northwestern.edu/files/11256269/download?download_frd=1&verifier=QvcfkfMKITuacpNIu7BcnezSgFuFZrmgTAFVVV6q",
        "assignmentId": "887070",
        "canvasId": 27087797,
        "grade": null,
        "groupId": null,
        "submitterId": 117530
    },
    {
        "submissionType": "online_upload",
        "submission": "https://canvas.northwestern.edu/files/11255656/download?download_frd=1&verifier=bAGtEOPeK3HCkzLuQkIoXc3fKPZUB0CRtm1znkDt",
        "assignmentId": "887070",
        "canvasId": 27087795,
        "grade": null,
        "groupId": 169432,
        "submitterId": 120532
    },
    {
        "submissionType": "online_upload",
        "submission": "https://canvas.northwestern.edu/files/11254446/download?download_frd=1&verifier=M0tBzq1IYbRsuuWLGDf3W9mUWhAAIate7mZRBKb5",
        "assignmentId": "887070",
        "canvasId": 27087800,
        "grade": null,
        "groupId": 169431,
        "submitterId": 120694
    },
    {
        "submissionType": "online_upload",
        "submission": "https://canvas.northwestern.edu/files/11256229/download?download_frd=1&verifier=OgIigokpBDboGL5rfuTaMkzDoZP87R39VaCzA28e",
        "assignmentId": "887070",
        "canvasId": 27087801,
        "grade": null,
        "groupId": 169439,
        "submitterId": 121082
    },
    {
        "submissionType": "online_upload",
        "submission": "https://canvas.northwestern.edu/files/11254649/download?download_frd=1&verifier=RLXMBhORNcm4nj0zU4kBGmt69mc4FxOnlfWtLBi2",
        "assignmentId": "887070",
        "canvasId": 27087802,
        "grade": null,
        "groupId": 169427,
        "submitterId": 121267
    },
    {
        "submissionType": "online_upload",
        "submission": "https://canvas.northwestern.edu/files/11256279/download?download_frd=1&verifier=spWYvTi5bj7vsSlb7fMjLYcVmPVNHMz4bcCc00m2",
        "assignmentId": "887070",
        "canvasId": 27087803,
        "grade": null,
        "groupId": 169449,
        "submitterId": 121452
    },
    {
        "submissionType": "online_upload",
        "submission": "https://canvas.northwestern.edu/files/11256252/download?download_frd=1&verifier=YHK5opCxiYEUDkyJbPWyjVc7UtgWXrlfjKIA9p4A",
        "assignmentId": "887070",
        "canvasId": 27087797,
        "grade": null,
        "groupId": null,
        "submitterId": 121518
    },
    {
        "submissionType": "online_upload",
        "submission": "https://canvas.northwestern.edu/files/11256139/download?download_frd=1&verifier=hta7laq517g8FeNebBM5GUXTl6msdZbmBkOo2LPG",
        "assignmentId": "887070",
        "canvasId": 27087784,
        "grade": null,
        "groupId": 169460,
        "submitterId": 121726
    },
    {
        "submissionType": "online_upload",
        "submission": "https://canvas.northwestern.edu/files/11256174/download?download_frd=1&verifier=stRBBp0D57ipgZblULBc8naqmZwM3UDVf1S6yQST",
        "assignmentId": "887070",
        "canvasId": 27087807,
        "grade": null,
        "groupId": 169442,
        "submitterId": 121734
    },
    {
        "submissionType": "online_upload",
        "submission": "https://canvas.northwestern.edu/files/11256174/download?download_frd=1&verifier=stRBBp0D57ipgZblULBc8naqmZwM3UDVf1S6yQST",
        "assignmentId": "887070",
        "canvasId": 27087807,
        "grade": null,
        "groupId": 169442,
        "submitterId": 121809
    },
    {
        "submissionType": "online_upload",
        "submission": "https://canvas.northwestern.edu/files/11256514/download?download_frd=1&verifier=J0TFeEUt3XqOm6pjJJrqOdCtHUpg1OYIyv99G7HH",
        "assignmentId": "887070",
        "canvasId": 27087785,
        "grade": null,
        "groupId": 169457,
        "submitterId": 122030
    },
    {
        "submissionType": "online_upload",
        "submission": "https://canvas.northwestern.edu/files/11242451/download?download_frd=1&verifier=dfTXCbmxGJIoJPdiEiagtbXKn2y9xqZrtebAmmiq",
        "assignmentId": "887070",
        "canvasId": 27087809,
        "grade": null,
        "groupId": 169420,
        "submitterId": 122274
    },
    {
        "submissionType": "online_upload",
        "submission": "https://canvas.northwestern.edu/files/11256279/download?download_frd=1&verifier=spWYvTi5bj7vsSlb7fMjLYcVmPVNHMz4bcCc00m2",
        "assignmentId": "887070",
        "canvasId": 27087803,
        "grade": null,
        "groupId": 169449,
        "submitterId": 122484
    },
    {
        "submissionType": "online_upload",
        "submission": "https://canvas.northwestern.edu/files/11256213/download?download_frd=1&verifier=hqVOonug3MVzSG0ldrGNUZNeo0dDvW35B9A0rT8k",
        "assignmentId": "887070",
        "canvasId": 27087783,
        "grade": null,
        "groupId": 169395,
        "submitterId": 123345
    },
    {
        "submissionType": "online_upload",
        "submission": "https://canvas.northwestern.edu/files/11256221/download?download_frd=1&verifier=EXPTh3tLEpdzoZS1dvfFr9z0qxiZhlhdufGtgm4T",
        "assignmentId": "887070",
        "canvasId": 27087813,
        "grade": null,
        "groupId": 169408,
        "submitterId": 134886
    },
    {
        "submissionType": "online_upload",
        "submission": "https://canvas.northwestern.edu/files/11256341/download?download_frd=1&verifier=k55MTK7VsaiNKmqhuozwUDQzKkL7YSr5AWU8UKbV",
        "assignmentId": "887070",
        "canvasId": 27087797,
        "grade": null,
        "groupId": null,
        "submitterId": 134890
    },
    {
        "submissionType": "online_upload",
        "submission": "https://canvas.northwestern.edu/files/11256437/download?download_frd=1&verifier=x1sbxdbRs3UlERRF5DpXWxkKaUSh02CcZ0Mm8c63",
        "assignmentId": "887070",
        "canvasId": 27087815,
        "grade": null,
        "groupId": 169463,
        "submitterId": 135346
    },
    {
        "submissionType": "online_upload",
        "submission": "https://canvas.northwestern.edu/files/11256202/download?download_frd=1&verifier=LH42AjGqZMjMIva7Ld5YRZNjrs5kvjM4M34auhVr",
        "assignmentId": "887070",
        "canvasId": 27214866,
        "grade": null,
        "groupId": 169406,
        "submitterId": 136799
    },
    {
        "submissionType": "online_upload",
        "submission": "https://canvas.northwestern.edu/files/11256437/download?download_frd=1&verifier=x1sbxdbRs3UlERRF5DpXWxkKaUSh02CcZ0Mm8c63",
        "assignmentId": "887070",
        "canvasId": 27087815,
        "grade": null,
        "groupId": 169463,
        "submitterId": 137037
    },
    {
        "submissionType": "online_upload",
        "submission": "https://canvas.northwestern.edu/files/11254446/download?download_frd=1&verifier=M0tBzq1IYbRsuuWLGDf3W9mUWhAAIate7mZRBKb5",
        "assignmentId": "887070",
        "canvasId": 27087800,
        "grade": null,
        "groupId": 169431,
        "submitterId": 137060
    },
    {
        "submissionType": "online_upload",
        "submission": "https://canvas.northwestern.edu/files/11256221/download?download_frd=1&verifier=EXPTh3tLEpdzoZS1dvfFr9z0qxiZhlhdufGtgm4T",
        "assignmentId": "887070",
        "canvasId": 27087813,
        "grade": null,
        "groupId": 169408,
        "submitterId": 142306
    },
    {
        "submissionType": "online_upload",
        "submission": "https://canvas.northwestern.edu/files/11256229/download?download_frd=1&verifier=OgIigokpBDboGL5rfuTaMkzDoZP87R39VaCzA28e",
        "assignmentId": "887070",
        "canvasId": 27087801,
        "grade": null,
        "groupId": 169439,
        "submitterId": 142368
    },
    {
        "submissionType": "online_upload",
        "submission": "https://canvas.northwestern.edu/files/11254649/download?download_frd=1&verifier=RLXMBhORNcm4nj0zU4kBGmt69mc4FxOnlfWtLBi2",
        "assignmentId": "887070",
        "canvasId": 27087802,
        "grade": null,
        "groupId": 169427,
        "submitterId": 142731
    },
    {
        "submissionType": "online_upload",
        "submission": "https://canvas.northwestern.edu/files/11256202/download?download_frd=1&verifier=LH42AjGqZMjMIva7Ld5YRZNjrs5kvjM4M34auhVr",
        "assignmentId": "887070",
        "canvasId": 27214866,
        "grade": null,
        "groupId": 169406,
        "submitterId": 143688
    },
    {
        "submissionType": "online_upload",
        "submission": "https://canvas.northwestern.edu/files/11250638/download?download_frd=1&verifier=JVGjiW9EwOgraAILMgtNUW5aGwoVUiWoBaGY1mZG",
        "assignmentId": "887070",
        "canvasId": 27087797,
        "grade": null,
        "groupId": null,
        "submitterId": 143937
    },
    {
        "submissionType": "online_upload",
        "submission": "https://canvas.northwestern.edu/files/11254924/download?download_frd=1&verifier=j32HC2n7AaEu7Jjbv9jGbH0f3gFll0qj2tZNfpxC",
        "assignmentId": "887070",
        "canvasId": 27087827,
        "grade": null,
        "groupId": 169428,
        "submitterId": 144815
    },
    {
        "submissionType": "online_upload",
        "submission": "https://canvas.northwestern.edu/files/11252386/download?download_frd=1&verifier=gqSkfsZ7NDfHS4p8Wyi5X7tVohCAVNX4JSdO3LxJ",
        "assignmentId": "887070",
        "canvasId": 27087828,
        "grade": null,
        "groupId": 169407,
        "submitterId": 149249
    },
    {
        "submissionType": "online_upload",
        "submission": "https://canvas.northwestern.edu/files/11256475/download?download_frd=1&verifier=RBEL82CFvVw6F1NiyorFXU2hRlXKWMstszxbJBbG",
        "assignmentId": "887070",
        "canvasId": 27087829,
        "grade": null,
        "groupId": 169450,
        "submitterId": 149415
    },
    {
        "submissionType": "online_upload",
        "submission": "https://canvas.northwestern.edu/files/11256547/download?download_frd=1&verifier=YJz975BaujXMShMm6u86H1vjcgipm4YrC9uWdlKi",
        "assignmentId": "887070",
        "canvasId": 27087781,
        "grade": null,
        "groupId": 169416,
        "submitterId": 163894
    },
    {
        "submissionType": "online_upload",
        "submission": "https://canvas.northwestern.edu/files/11256475/download?download_frd=1&verifier=RBEL82CFvVw6F1NiyorFXU2hRlXKWMstszxbJBbG",
        "assignmentId": "887070",
        "canvasId": 27087829,
        "grade": null,
        "groupId": 169450,
        "submitterId": 169929
    },
    {
        "submissionType": "online_upload",
        "submission": "https://canvas.northwestern.edu/files/11249657/download?download_frd=1&verifier=ihFlYyqHcpHSPgRAduRCsUD4iC1WInbI0UKHDvF1",
        "assignmentId": "887070",
        "canvasId": 27087835,
        "grade": null,
        "groupId": 169443,
        "submitterId": 169960
    },
    {
        "submissionType": "online_upload",
        "submission": "https://canvas.northwestern.edu/files/11242451/download?download_frd=1&verifier=dfTXCbmxGJIoJPdiEiagtbXKn2y9xqZrtebAmmiq",
        "assignmentId": "887070",
        "canvasId": 27087809,
        "grade": null,
        "groupId": 169420,
        "submitterId": 169983
    },
    {
        "submissionType": "online_upload",
        "submission": "https://canvas.northwestern.edu/files/11256220/download?download_frd=1&verifier=C0nke4q5At7aUFJWyspxT3M5hjYW6oPnJB8zvGG5",
        "assignmentId": "887070",
        "canvasId": 27087793,
        "grade": null,
        "groupId": 169434,
        "submitterId": 170152
    },
    {
        "submissionType": "online_upload",
        "submission": "https://canvas.northwestern.edu/files/11256236/download?download_frd=1&verifier=l1YLhqssECpU62FfcJfU4LpjG1Xgnfyze1iOZZJI",
        "assignmentId": "887070",
        "canvasId": 27087797,
        "grade": null,
        "groupId": null,
        "submitterId": 170828
    },
    {
        "submissionType": "online_upload",
        "submission": "https://canvas.northwestern.edu/files/11254924/download?download_frd=1&verifier=j32HC2n7AaEu7Jjbv9jGbH0f3gFll0qj2tZNfpxC",
        "assignmentId": "887070",
        "canvasId": 27087827,
        "grade": null,
        "groupId": 169428,
        "submitterId": 172788
    },
    {
        "submissionType": "online_upload",
        "submission": "https://canvas.northwestern.edu/files/11249657/download?download_frd=1&verifier=ihFlYyqHcpHSPgRAduRCsUD4iC1WInbI0UKHDvF1",
        "assignmentId": "887070",
        "canvasId": 27087835,
        "grade": null,
        "groupId": 169443,
        "submitterId": 172831
    },
    {
        "submissionType": "online_upload",
        "submission": "https://canvas.northwestern.edu/files/11251661/download?download_frd=1&verifier=TqoLG1Ad5MjwO4HlO4kq0wgqlTf8PPvTAUZrB9U6",
        "assignmentId": "887070",
        "canvasId": 27087775,
        "grade": null,
        "groupId": 169441,
        "submitterId": 172943
    }
]

export default dataset1;