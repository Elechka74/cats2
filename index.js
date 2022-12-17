// // api.getCats("elvira")
// const getCats = async() => {
//     const responce = await fetch('https://cats.petiteweb.dev/api/single/elvira/show');
//     const data = await responce.json()
//     console.log(data);
// }

// // getCats()

// const getCat = async() => {
//     Api
//     const responce = await fetch('https://cats.petiteweb.dev/api/single/elvira/show/11');
//     const data = await responce.json()
//     console.log(data);
// }
// // getCat()

// const getCatsIds = async() => {
//     const responce = await fetch('https://cats.petiteweb.dev/api/single/elvira/ids');
//     const data = await responce.json()
//     console.log(data);
// }
// // getCatsIds()



// const addCat = async() => {
//     const newCat = {

//         id: 333,
//         name: "Кася",
//         favorite: true,
//         rate: 9,
//         age: 2,
//         description: "Ласковая кошка",
//         image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOOBpql1q0erg1_A_opjIRkfcXteviUTrgoVUehzQJJznlMZXOH9oP0hjVFuy14BMgEok&usqp=CAU"

//     }
//     const responce = await fetch('https://cats.petiteweb.dev/api/single/elvira/add', {
//         method: 'POST',
//         headers: {
//             'Accept': 'application/json',
//             'Content-type': 'application/json'
//         },
//         body: JSON.stringify(newCat)
//     });
//     const data = await responce.json()
//     console.log(data);
// }
// // addCat()


// const changeidObj = { id: 7}

// const changeCat = async() => {
//     const responce = await fetch('https://cats.petiteweb.dev/api/single/elvira/update/14', {
//         method: 'PUT',
//         headers: {
//             'Accept': 'application/json',
//             'Content-type': 'application/json'
//         },
//         body: JSON.stringify(changeidObj)
//     });
//     const data = await responce.json()
//     console.log(data);
// }
// // changeCat()

// const api = new Api('elvira');

// //на промисах
// api.getCats().then(res => res.json()).then(data => console.log(data))


// // на async/await
// // const getting = async () => {
// //     const res = await api.getCats();
// //     const data = await res.json()
// //     console.log(data);
// // }
// // getting()

// const adding = async (body) => {
// const res = await api.addCat(body)
// const data = await res.json()
// console.log(data);
// }
// // adding(newCat)

// const deleting = async (id) => {
//     const res = await api.delCat(id)
//     const data = await res.json()
//     console.log(data);
//     }
//     // deleting(333)


const $wrapper = document.querySelector('[data-wrapper]');
const $addButton = document.querySelector('[data-add_button]');
const $modal = document.querySelector('[data-modal]');
const $spinner = document.querySelector('[data-spinner]');
const $closeButton = document.querySelector('[data-close_button]');

const api = new Api('elvira')

const gerenatioCatCard = (cat) => `<div data-card_id=${cat.id} class="card" style="width: 18rem;">
<img src="${cat.image}" class="card-img-top" alt="${cat.name}">
<div class="card-body">
  <h5 class="card-title">${cat.name}</h5>
  <p class="card-text">${cat.description}</p>
  <button data-action= "show" type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#showCatModal">Show</button>
  <button data-action= "delete" class="btn btn-danger">Delete</button>
</div>
</div>`

$wrapper.addEventListener('click', (event) => {
  // console.log(event.target.dataset);
  switch (event.target.dataset.action) {
    case 'delete':
      const $currentCard = event.target.closest("[data-card_id]")
      const catId = $currentCard.dataset.card_id
      console.log(catId);
      api.delCat(catId)
      $currentCard.remove()
      break;


    case 'show':
      const $showCard = event.target.closest("[data-card_id]")
      const catShowId = $showCard.dataset.card_id
      console.log(catShowId);

      $spinner.classList.remove('hidden')

      api.getCat(catShowId)
        .then((responce) => {
          return responce.json()
        })
        .then((cat) => {
          $spinner.classList.add('hidden')

          const showModal = document.getElementById('showCatModal')
          const name = showModal.querySelector('.cat-name')
          name.textContent = `${cat.name}`

          const desc = showModal.querySelector('.cat-description')
          desc.textContent = `${cat.description}`

          const age = showModal.querySelector('.cat-age')
          age.textContent = `Возраст: ${cat.age}`

          const rate = showModal.querySelector('.cat-rate')
          rate.textContent = `Рейтинг: ${cat.rate}`

          const fav = showModal.querySelector('.cat-favorite')
          fav.textContent = `Любимый: ${cat.favorite ? 'да' : 'нет'}`
        });

      break;

    default:
      break;
  }
})

document.forms.catsForm.addEventListener('submit', (event) => {
  event.preventDefault();



  const data = Object.fromEntries(new FormData(event.target).entries());

  data.age = Number(data.age)
  data.id = Number(data.id)
  data.rate = Number(data.rate)
  data.favorite = data.favorite === 'on'

  console.log(data);

  api.addCat(data).then(res => res.ok && $modal.classList.remove('hidden'))
})

$addButton.addEventListener('click', () => {
  $modal.classList.remove('hidden')
})

$closeButton.addEventListener('click', () => {
  $modal.classList.add('hidden')
})

api.getCats()
  .then((responce) => {
    return responce.json()
  })
  .then((data) => {
    setTimeout(() => {
      $spinner.classList.add('hidden')
      data.forEach(cat => {
        $wrapper.insertAdjacentHTML('beforeend', gerenatioCatCard(cat))
      })
    }, 1000);

  });

