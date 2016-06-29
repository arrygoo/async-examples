import { Meteor } from 'meteor/meteor';
const rp = require('request-promise');

// Make request using callbacks
function makeRequest(url, callback) {
  HTTP.call('GET', `http://jsonplaceholder.typicode.com/${url}`, {},
    (err, response) => callback(null, response.data)
  );
};

// Make request using AsyncWrap
const makeRequestSync = Meteor.wrapAsync(makeRequest);

// Make request using promises
const makeRequestPromise = (url) => {
  const options = {
    uri: `http://jsonplaceholder.typicode.com/${url}`,
    json: true,
  };
  return rp(options);
};

Meteor.startup(() => {

/******* Example with callbackhell *******/
  function getFirstCommentCallback() {
    makeRequest(`users/1`, (userErr, userResults) => {
      if (userErr) {
        throw new Meteor.Error(userErr);
      }
      const userId = userResults.id;
      makeRequest(`posts?userId=${userId}`, (postErr, postResults) => {
        if (postErr) {
          throw new Meteor.Error(postErr);
        }
        const postId = postResults[0].id;
        makeRequest(`posts/${postId}/comments`, (commentsErr, commentsResults) => {
          if (commentsErr) {
            throw new Meteor.Error(commentsErr);
          }
          console.log(commentsResults[0]);
        });
      });
    });
  }
  /******* End of example with callbackhell *******/

  /******* Example with improved callback *******/
  function handleErr(err) {
    if (err) { throw new Meteor.Error(err); }
  }

  function getUserFirstCommentFromPostId (postId) {
    makeRequest(`posts/${postId}/comments`, (err, results) => {
      handleErr(err);
      console.log(results[0]);
    });
  };

  function getFirstCommentFromUserId(userId) {
    makeRequest(`posts?userId=${userId}`, (err, results) => {
      handleErr(err);
      getUserFirstCommentFromPostId(results[0].id);
    });
  };

  function getFirstCommentImrpovedCallback() {
    makeRequest(`users/1`, (err, results) => {
      handleErr(err);
      getFirstCommentFromUserId(results.id);
    });
  }
  /******* End of example improved callback *******/


  /******* Example with caolon:async *******/
  function getFirstCommentCaolonAsync() {
    async.waterfall([
      (callback) => makeRequest(`users/1`, callback),
      (userResults, callback) => makeRequest(`posts?userId=${userResults.id}`, callback),
      (postResults, callback) => makeRequest(`posts/${postResults.id}/comments`, callback),

    ], (err, comments) => {
      if (err) {
        throw new Meteor.Error(err);
      }
      console.log(comments[0]);
    });
  }
  /******* End of caolon:async *******/

  /******* Example with promises *******/
  function getFirstCommentPromises() {
    makeRequestPromise(`users/1`)
    .then(results => makeRequestPromise(`posts?userId=${results.id}`))
    .then(results => makeRequestPromise(`posts/${results[0].id}/comments`))
    .then(results => console.log(results[0]))
    .catch(err => {
      throw new Meteor.Error(err);
    });
  }
  /******* End of promises *******/


  /******* Example with async/await and promises *******/
  async function getFirstCommentAsyncAwait(){
    try {
      userResults = await getJSONfromAPIPromise(`users/5`);
      postResults = await getJSONfromAPIPromise(`posts?userId=${userResults.id}`);
      comments = await getJSONfromAPIPromise(`posts/${postResults[0].id}/comments`);
      console.log(comments[0]);
    } catch (err) {
      throw new Meteor.Error(err);
    }
  };
  /******* End of async/await and promises *******/

  /******** Example using wrapAsync ********/
  function getFirstCommentWrapAsync() {
    try {
      userResults = getJSONfromAPISync(`users/5`);
      postResults = getJSONfromAPISync(`posts?userId=${userResults.id}`);
      comments = getJSONfromAPISync(`posts/${postResults[0].id}/comments`);
      console.log(comments[0]);
    } catch (err) {
      throw new Meteor.Error(err);
    }
  }
  /******** End of wrapAsync *******/

  // Uncomment one of the below to see the example running:
  getFirstCommentCallback();
  // getFirstCommentImrpovedCallback();
  // getFirstCommentCaolonAsync();
  // getFirstCommentPromises();
  // getFirstCommentAsyncAwait();
  // getFirstCommentWrapAsync();

});
