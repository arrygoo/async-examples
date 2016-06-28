import { Meteor } from 'meteor/meteor';
// import request-promise from 'request-promise';

// this is equivalent to the standard node require:
const rp = require('request-promise');


// Get JSON from API
const getJSONfromAPI = (url, callback) => {
  HTTP.call('GET', `http://jsonplaceholder.typicode.com/${url}`, {
  }, (err, response) => {
    if (err) {
      callback(err);
    } else {
      callback(null, response.data);
    }
  });
};

// Get JSON from API
const getJSONfromAPIPromise = (url) => {
  const options = {
    uri: `http://jsonplaceholder.typicode.com/${url}`,
    json: true,
  };
  return rp(options);
};

Meteor.startup(() => {

/******* Example with callbackhell *******/
  // Get the 5th user
  // getJSONfromAPI(`users/5`, (userErr, userResults) => {
  //   if (userErr) {
  //     throw new Meteor.Error(userErr);
  //   }
  //   const userId = userResults.id;
  //   getJSONfromAPI(`posts?userId=${userId}`, (postErr, postResults) => {
  //     if (postErr) {
  //       throw new Meteor.Error(postErr);
  //     }
  //     const postId = postResults[0].id;
  //     getJSONfromAPI(`posts/${postId}/comments`, (commentsErr, commentsResults) => {
  //       if (commentsErr) {
  //         throw new Meteor.Error(commentsErr);
  //       }
  //       console.log(commentsResults[0]);
  //     });
  //   });
  // });
  /******* End of example with callbackhell *******/

  /******* Example with improved callback *******/
  // function handleErr(err) {
  //   if (err) { throw new Meteor.Error(err); }
  // }
  //
  // const getUserFirstCommentFromPostId = (postId) => {
  //   getJSONfromAPI(`posts/${postId}/comments`, (err, results) => {
  //     handleErr(err);
  //     console.log(results[0]);
  //   });
  // };
  //
  // const getFirstCommentFromUserId = (userId) => {
  //   getJSONfromAPI(`posts?userId=${userId}`, (err, results) => {
  //     handleErr(err);
  //     getUserFirstCommentFromPostId(results[0].id);
  //   });
  // };
  //
  // getJSONfromAPI(`users/5`, (err, results) => {
  //   handleErr(err);
  //   getFirstCommentFromUserId(results.id);
  // });

  /******* End of example with callbackhell *******/


  // /******* Example with caolon:async *******/
  // async.waterfall([
  //   (callback) => {
  //     getJSONfromAPI(`users/5`, (err, results) => {
  //       callback(err, results.id);
  //     });
  //   },
  //   (userId, callback) => {
  //     getJSONfromAPI(`posts?userId=${userId}`, (err, results) => {
  //       callback(err, results[0].id);
  //     });
  //   },
  //   (postId, callback) => {
  //     getJSONfromAPI(`posts/${postId}/comments`, (err, results) => {
  //       callback(err, results);
  //     });
  //   },
  // ], (err, results) => {
  //   if (err) {
  //     throw new Meteor.Error(err);
  //   }
  //   console.log(results[0]);
  // });
  // /******* End of caolon:async *******/
  //
  /******* Example with promises *******/
  // getJSONfromAPIPromise(`users/5`)
  // .then(results => getJSONfromAPIPromise(`posts?userId=${results.id}`))
  // .then(results => getJSONfromAPIPromise(`posts/${results[0].id}/comments`))
  // .then(results => console.log(results[0]))
  // .catch(err => {
  //   throw new Meteor.Error(err);
  // });
  /******* End of promises *******/


  /******* Example with async/await and promises *******/
  async function getComments(){
    try {
      userResults = await getJSONfromAPIPromise(`users/5`);
      postResults = await getJSONfromAPIPromise(`posts?userId=${userResults.id}`);
      comments = await getJSONfromAPIPromise(`posts/${postResults[0].id}/comments`);
      console.log(comments[0]);
    } catch (err) {
      throw new Meteor.Error(err);
    }
  };
  getComments();
  /******* End of async/await and promises *******/


});
