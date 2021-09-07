"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  const showHeart = Boolean(currentUser);


  return $(`
      <li id="${story.storyId}">
        <span class="trash hidden">&#128465;</span>
        ${showHeart ? getHeartHTML(story, currentUser) : ''}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** Submits new story and posts it on the page */
async function submitNewStory(evt) {
  evt.preventDefault();

  const author = $("#story-author").val();
  const title = $("#story-title").val();
  const url = $("#story-url").val();
  
  const newStory = await storyList.addStory(currentUser, { title, author, url });
  const $story = generateStoryMarkup(newStory);
  $allStoriesList.prepend($story);
  
  $("#story-author, #story-title, #story-url").val('');

  $storyForm.fadeOut(500, () => {
    $storyForm.hide();
    getAndShowStoriesOnStart();
  });
}

$storyForm.on("submit", submitNewStory);

/** Display favorites on page */

function populateFavorites() {
  $allFavoritesList.empty();
  hidePageComponents();

  const myFavorites = currentUser.favorites;

  if(myFavorites.length === 0) {
    $allFavoritesList.html('You have no favorites! Click the &#9825; next to a story to add one to your favorites!');
  } else for(let story of myFavorites) {
    const $story = generateStoryMarkup(story);
    $allFavoritesList.append($story);
  }
  $allFavoritesList.show();
}

/** Displays correct heart HTML */

function getHeartHTML(story, currentUser) {
  const isFavorite = currentUser.isFavorite(story);
  const heartType = isFavorite ? "favorite" : 'non-favorite';

  return `<span class="${heartType} heart"></span>`
}

// Handles when user clicks on the heart
async function handleHeartClick() {
  const $storyId = $(this).parent().attr('id');
  const $story = storyList.stories.find(s => s.storyId === $storyId);


  if($(this).hasClass('favorite')) {
    await currentUser.removeFavorite($story);
    $(this).toggleClass('favorite non-favorite');
  } else {
    await currentUser.addFavorite($story);
    $(this).toggleClass('favorite non-favorite');
  }
}

$allStoriesList.on('click', '.heart', handleHeartClick);
$allFavoritesList.on('click', '.heart', handleHeartClick);
$allMyStoriesList.on('click', '.heart', handleHeartClick);


/** Display my stories on page */

function populateMyStories() {
  $allMyStoriesList.empty();
  hidePageComponents();

  const myStories = currentUser.ownStories;

  if(myStories.length === 0) {
    $allMyStoriesList.html("<p>You have no stories! Click submit to add a story.</p>");
  } else {
    for(let story of myStories) {
      const $story = generateStoryMarkup(story);
      $allMyStoriesList.append($story);
    }
    const $trash = $(".hidden");
    $trash.removeClass("hidden");
  }
  $allMyStoriesList.show();
}

//** Removes user's story from UI */

async function removeAStoryFromUI(evt) {
  const storyId = evt.target.parentElement.id

  await storyList.removeAStoryFromAPI(storyId);
  evt.target.parentElement.remove();
}

$allMyStoriesList.on('click', '.trash', removeAStoryFromUI);


// TO-DO
// populate my stories without refresh after submitting a story
//