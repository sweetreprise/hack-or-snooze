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
  return $(`
      <li id="${story.storyId}">
        <span class="trash">&#128465;</span>
        <input type="checkbox" class="favorites-checkbox">
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
  
  $storyForm.val('');
  $storyForm.fadeOut(500, () => $storyForm.hide());
}

$storyForm.on("submit", submitNewStory);

/** Display favorites on page */
function populateFavorites() {

}

/** Display my stories on page */
function populatemyStories() {
  $allMyStories.empty();

  const myStories = currentUser.ownStories;

  if(!myStories) {
    $allMyStories.html("<p>You have no stories! Click submit to add a story.</p>");
  } else {
    for(let story of myStories) {
      const $story = generateStoryMarkup(story);
      $allMyStories.append($story);
    }
    const $trash = $(".trash");
    $trash.removeClass("trash");
  }
  $allMyStories.show();
}

function removeAStory(evt) {
  evt.target.parentElement.remove();
}

$allMyStories.on('click', 'span', removeAStory);

//TO-DO: delete story from API
