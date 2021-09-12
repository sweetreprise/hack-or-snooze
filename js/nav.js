"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

/** Show new story form when user clicks on "submit" */

function submitStoryClick() {
  hidePageComponents();
  $("#story-author, #story-title, #story-url").val('');
  $storyForm.show();
  $allStoriesList.before($storyForm);
}

$navStory.on('click', submitStoryClick);

/** Show favorite stories when user clicks on 'favorites' */

function showFavoritesClick() {
  hidePageComponents();
  populateFavorites();
  $allFavoritesList.show();
}

$navFavorites.on('click', showFavoritesClick);

/** Shows user's stories when user clicks on 'my stories' */

function showMyStoriesClick() {
  hidePageComponents();
  populateMyStories();
}

$navMyStories.on('click', showMyStoriesClick);