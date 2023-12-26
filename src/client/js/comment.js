const videoContainer = document.getElementById("videoContainer");
const commentForm = document.getElementById("commentForm");
const textarea = commentForm.querySelector("textarea");
const deleteBtns = document.querySelectorAll("#commentsList i");

const TEXTAREA_DEFAULT_HEIGHT = 20;

const addComment = (text, id, owner) => {
  const comment = document.createElement("li");
  const avatar = document.createElement("a");
  const avatarImg = document.createElement("img");
  const name = document.createElement("a");
  const content = document.createElement("span");
  const deleteBtn = document.createElement("i");

  comment.dataset.id = id;
  avatar.href = `/users/${owner._id}`;
  avatarImg.src = owner.avatarUrl || "/uploads/chiikawa.png";
  if (owner.avatarUrl) {
    avatarImg.src =
      owner.avatarUrl[0] === "h" ? `${owner.avatarUrl}` : `/${owner.avatarUrl}`;
  } else {
    avatarImg.src = "/uploads/chiikawa.png";
  }
  avatar.appendChild(avatarImg);
  name.innerText = owner.name;
  content.innerText = text;
  deleteBtn.addEventListener("click", handleDeleteBtnClick);

  comment.classList = "comment";
  avatar.classList = "comment__avatar";
  name.classList = "comment__name";
  content.classList = "comment__content";
  deleteBtn.classList = "fas fa-trash comment__delete-btn";

  comment.appendChild(avatar);
  comment.appendChild(name);
  comment.appendChild(content);
  comment.appendChild(deleteBtn);

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
    textarea.style.height = TEXTAREA_DEFAULT_HEIGHT + "px";
    const { commentId, owner } = await response.json();
    addComment(text, commentId, owner);
  }
};

const handleTextareaInput = (event) => {
  const { target } = event;

  target.style.height = 0;
  target.style.height =
    TEXTAREA_DEFAULT_HEIGHT + target.scrollHeight - 30 + "px";
};

const handleDeleteBtnClick = async (event) => {
  const targetComment = event.target.parentElement;

  const { id } = targetComment.dataset;
  const { status } = await fetch(`/api/comments/${id}`, { method: "DELETE" });

  if (status === 200) {
    targetComment.remove();
  } else {
    console.log("error");
  }
};

commentForm.addEventListener("submit", handleSubmit);
textarea.addEventListener("input", handleTextareaInput);
deleteBtns.forEach((deleteBtn) =>
  deleteBtn.addEventListener("click", handleDeleteBtnClick)
);
