document.addEventListener("DOMContentLoaded", () => {
  const baseUrl = "http://localhost:3000/quotes"
  const ul = document.querySelector("#quote-list")
  const form = document.querySelector("#new-quote-form")

  form.addEventListener('submit', handleSubmit)
  ul.addEventListener('click', handleClick)

  fetchAllQuotes()

  function fetchAllQuotes(){
    fetch(baseUrl)
    .then(res => res.json())
    .then(res => {
      res.forEach(quote => renderQuote(quote))
    })
  }

  function renderQuote(quote){
    let quoteLi = `
    <li class="quote-card">
      <blockquote class="blockquote">
        <p class="mb-0">${quote.quote}</p>
        <footer class="blockquote-footer">${quote.author}</footer>
        <br>
        <button data-id="${quote.id}" class="btn-success">Likes: <span>${quote.likes}</span></button>
        <button data-id="${quote.id}" class="btn-danger">Delete</button>
      </blockquote>
    </li>
    `
    ul.innerHTML += quoteLi

  }

  function handleSubmit(e){
    e.preventDefault()
    let inputQuote = document.querySelector("#new-quote")
    let inputAuthor = document.querySelector("#author")

    // console.log(inputQuote)
    // console.log(inputAuthor)

    let data = {
      likes: 1,
      author: inputAuthor.value,
      quote: inputQuote.value
    }

    postQuote(data)
    .then(quote => renderQuote(quote))

    inputQuote.value = ""
    inputAuthor.value = ""
  }

  function postQuote(data){
    return fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }).then(res => res.json())
  }

  function handleClick(e){
    if (e.target.className === "btn-danger"){
      deleteQuote(e.target.dataset.id)
      let button = e.target
      let blockquote = button.parentElement
      let li = blockquote.parentElement
      li.remove()
    } else if (e.target.className === "btn-success"){
      let button = e.target
      let span = button.querySelector("span")
      let spanLikes = parseInt(span.innerText) + 1
      span.innerText = spanLikes

      let data = {likes: `${spanLikes}`}

      increaseLikes(button.dataset.id, data)
    }
  }

  function increaseLikes(id, data){
    let quoteUrl = baseUrl + `/${id}`
    return fetch(quoteUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }).then(res => res.json())
  }

  function deleteQuote(id){
    let quoteUrl = baseUrl + `/${id}`
    return fetch(quoteUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => res.json())
  }





})
