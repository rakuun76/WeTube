const videoContainer = document.getElementById("videoContainer");
const commentForm = document.getElementById("commentForm");
const textarea = commentForm.querySelector("textarea");
const deleteBtns = document.querySelectorAll("#commentsList button");

const addComment = (text, id) => {
  const comment = document.createElement("li");
  const span = document.createElement("span");
  const button = document.createElement("button");
  span.innerText = text;
  button.innerText = "❌";
  comment.dataset.id = id;
  comment.appendChild(span);
  comment.appendChild(button);

  const commentsList = document.getElementById("commentsList");
  commentsList.prepend(comment);
};

const handleSubmit = async (event) => {
  event.preventDefault();

  const { id } = videoContainer.dataset;
  const text = textarea.value;

  const response = await fetch(`/api/videos/${id}/comment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (response.status === 201) {
    textarea.value = "";
    const { commentId } = await response.json();
    addComment(text, commentId);
  }
};

const handleDeleteBtnClick = async (event) => {
  const targetComment = event.target.parentElement;

  const { id } = targetComment.dataset;
  const { status } = await fetch(`/api/comments/${id}`, { method: "DELETE" });

  if (status === 200) {
    targetComment.remove();
  }
};

commentForm.addEventListener("submit", handleSubmit);
deleteBtns.forEach((deleteBtn) =>
  deleteBtn.addEventListener("click", handleDeleteBtnClick)
);
