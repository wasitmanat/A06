
const removeActiveClass = () => {
    const buttons = document.getElementsByClassName("category-btn");
    console.log(buttons);
    for (let btn of buttons) {
        btn.classList.remove("active");
        console.log(btn);
    }
}


const loadCategories = () => {
    fetch('https://openapi.programming-hero.com/api/peddy/categories')
        .then(res => res.json())
        .then(data => displayCategories(data.categories))
        .catch(err => console.error(err))
}

const loadAllCards = () => {
    fetch('https://openapi.programming-hero.com/api/peddy/pets')
        .then(res => res.json())
        .then(data => displayAllCards(data.pets))
        .catch(err => console.error(err))
}

const loadCategoryWiseAnimals = (categoryName) => {
    document.getElementById('loading').classList.remove("hidden");

    document.getElementById('cards-container').innerHTML = "";


    fetch(`https://openapi.programming-hero.com/api/peddy/category/${categoryName}`)
        .then(res => res.json())
        .then(data => {
            removeActiveClass();

            const activeBtn = document.getElementById(`btn-${categoryName}`)
            activeBtn.classList.add("active");

            setTimeout(function () {
                displayAllCards(data.data);
            }, 2000);

        })
        .catch(err => console.error(err))
}

const loadDetails = (petId) => {
    fetch(`https://openapi.programming-hero.com/api/peddy/pet/${petId}`)
        .then(res => res.json())
        .then(data => displayDetails(data.petData))
        .catch(err => console.error(err))
}

const showLikedPhotos = (likedPhoto) => {
    const showContainer = document.getElementById('liked-container');

    const picture = document.createElement("div");
    picture.classList.add("p-2", "border-2", "rounded-xl", "m-2")
    picture.innerHTML = `
        <img class="w-full h-full rounded-xl" src="${likedPhoto}">
    `;
    showContainer.append(picture);
}

const loadAdoptModal = (petId) => {
    const customModal2 = document.getElementById('customModal2');
    const countBox = document.getElementById('countBox');
    let count = 3;

    customModal2.showModal();

    const countInterval = setInterval(() => {
        countBox.innerText = `${count}`;
        count--;

        if (count === -1) {
            clearInterval(countInterval);
            customModal2.close();
        }
    }, 1000);
    countBox.innerText = "";
    document.getElementById(`card-btn-${petId}`).innerText = "Adopted";
    document.getElementById(`card-btn-${petId}`).setAttribute('disabled', true);
}

const laodSortByPrice = () => {
    fetch('https://openapi.programming-hero.com/api/peddy/pets')
        .then(res => res.json())
        .then(data => {
            data.pets.sort((a, b) => b.price - a.price)
            displayAllCards(data.pets)
        })
        .catch(err => console.error(err))
}



const displayCategories = (datas) => {
    const catrgoriesContainer = document.getElementById('category-container');

    datas.forEach((item) => {
        const buttonDiv = document.createElement("div");
        buttonDiv.classList.add("buttonDivStyles", "rounded-2xl", "buttonHover", "category-btn");
        buttonDiv.id = `btn-${item.category}`;

        buttonDiv.innerHTML = `
            <button class="rounded-xl text-2xl font-bold buttons"> 
                <img src="${item.category_icon}" class="inline"> ${item.category}s 
            </button>
        `;

        catrgoriesContainer.appendChild(buttonDiv);

        buttonDiv.addEventListener('click', () => {
            loadCategoryWiseAnimals(item.category);
            document.getElementById('loading').classList.remove("hidden");
        })

    });
}

const displayAllCards = (cards) => {
    const cardsContainer = document.getElementById('cards-container');
    document.getElementById('loading').classList.add("hidden");
    cardsContainer.innerHTML = "";

    if (cards.length === 0) {
        cardsContainer.classList.remove('grid');
        cardsContainer.classList.add("bg-[#F8F8F8]", "p-10", "lg:p-36", "rounded-2xl");
        cardsContainer.innerHTML = `
            <div class="text-center">
                <img class="mx-auto" src="images/error.webp">
                <h2 class="text-3xl font-bold mb-4 mt-4"> No Information Available </h2>
                <p class="text-secondary-color"> The requested details are currently not available or accessible. Please check back later or contact support for further assistance. Thanks for being with us. </p>
            </div>
        `;
        return;
    }
    else {
        cardsContainer.classList.add('grid');
        cardsContainer.classList.remove("bg-[#F8F8F8]", "lg:p-36", "rounded-2xl");
    }


    cards.forEach((card) => {

        const singleCard = document.createElement("div");
        singleCard.classList.add("cardStyle")

        singleCard.innerHTML = `
            <img class="mb-5 w-full h-[170px] rounded-xl" src="${card.image}"/>
            <h3 class="text-lg font-bold"> ${card.pet_name} </h3>

            <div class="flex items-center gap-x-2 text-secondary-color">
                <i class="fa-solid fa-border-all"></i>
                <p> Breed: ${card.breed ? card.breed : "Not Available"} </p>
            </div> 

            <div class="flex items-center gap-x-2 text-secondary-color">
                <i class="fa-regular fa-calendar-days"></i>
                <p> Birth: ${card.date_of_birth ? card.date_of_birth : "Not Available"} </p>
            </div> 

            <div class="flex items-center gap-x-2 text-secondary-color">
                <i class="fa-solid fa-venus"></i>
                <p> Gender: ${card.gender ? card.gender : "Not Available"} </p>
            </div> 

            <div class="flex items-center gap-x-2 text-secondary-color mb-4">
                <i class="fa-solid fa-dollar-sign"></i>
                <p> Price: ${card.price ? `${card.price}$` : "Not Available"} </p>
            </div> 

            <hr>

            <div class="cardButtons flex justify-between mt-4">
                <div>
                    <button onclick="showLikedPhotos('${card.image}')" id="" class="btn bg-transparent border-2 cardBtn"> <i class="fa-regular fa-thumbs-up"></i> </button>
                </div>

                <div>
                    <button onclick="loadAdoptModal(${card.petId})" id="card-btn-${card.petId}" class="btn bg-transparent border-2 adoptcardBtn"> Adopt </button>
                </div>

                <div>
                    <button onclick="loadDetails(${card.petId})" id="" class="btn bg-transparent border-2 cardBtn"> Details </button>
                </div>
            </div>
        `;

        cardsContainer.append(singleCard);

    })
}

const displayDetails = (petInfo) => {
    console.log(petInfo);
    const detailsContainer = document.getElementById('modal-content');

    detailsContainer.innerHTML = `
        <img class="w-full" src='${petInfo.image}'>
        <h2 class="text-xl font-bold mt-4 mb-4"> ${petInfo.pet_name} </h2>

        <div class="grid grid-cols-2">
            <div class="flex items-center gap-x-2 text-secondary-color">
                <i class="fa-solid fa-border-all"></i>
                <p> Breed: ${petInfo.breed ? petInfo.breed : "Not Available"} </p>
            </div> 

            <div class="flex items-center gap-x-2 text-secondary-color">
                <i class="fa-regular fa-calendar-days"></i>
                <p> Birth: ${petInfo.date_of_birth ? petInfo.date_of_birth : "Not Available"} </p>
            </div> 

            <div class="flex items-center gap-x-2 text-secondary-color">
                <i class="fa-solid fa-venus"></i>
                <p> Gender: ${petInfo.gender ? petInfo.gender : "Not Available"} </p>
            </div> 

            <div class="flex items-center gap-x-2 text-secondary-color mb-4">
                <i class="fa-solid fa-dollar-sign"></i>
                <p> Price: ${petInfo.price ? `${petInfo.price}$` : "Not Available"} </p>
            </div> 

            <div class="flex items-center gap-x-2 text-secondary-color mb-4">
                <i class="fa-solid fa-syringe"></i>
                <p> Vacinated Status: ${petInfo.vaccinated_status ? petInfo.vaccinated_status : "Not Available"} </p>
            </div>
        </div
        <hr>

        <h3 class="text-lg font-bold mt-4 mb-4"> Details Information </h3>
        <p> ${petInfo.pet_details} </p>
    `;

    document.getElementById('customModal').showModal();
}

const displayAdoptModal = (petModal) => {
    console.log(petModal);
}



loadCategories();
loadAllCards();