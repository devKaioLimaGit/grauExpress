let data;
const sessionProduct = document.querySelector("#product");
const inputSearch = document.querySelector(".input-search");
const buttonHamburgueres = document.querySelector(".hamburgueres");
const buttonSnacks = document.querySelector(".snacks");
const buttonDrinks = document.querySelector(".drinks");
const buttonCart = document.querySelector(".cart");

console.log(buttonHamburgueres);

buttonHamburgueres.addEventListener("click", () => {});
buttonSnacks.addEventListener("click", () => {});
buttonDrinks.addEventListener("click", () => {});
buttonCart.addEventListener("click", () => {});

async function loadingProduct() {
  try {
    const response = await fetch("./assets/json/product.json");
    if (!response.ok) {
      console.log("Erro ao fazer a requisição.");
      return;
    }
    data = await response.json();
    console.log(data);
    data.forEach((product) =>
      loadsOnScreen(
        product.image,
        product.name,
        product.description,
        product.price,
        product // passando o produto inteiro
      )
    );
  } catch (error) {
    console.error("Erro ao processar a requisição:", error);
  }
}

function loadsOnScreen(image, name, description, price, product) {
  const div = document.createElement("div");
  div.classList.add("card");
  div.innerHTML = `    
    <img class="product-image" src="${image}" alt="Image of ${name}" />
    <h1 class="product-name">${name}</h1>
    <p class="product-description">${description}</p>
    <span class="product-price">$${price.toFixed(2)}</span>
    <button class="add-to-cart-button">Add to Cart</button>
  `;

  div.querySelector(".add-to-cart-button").addEventListener("click", () => {
    // Recuperando os itens do carrinho, ou criando um array vazio caso não exista
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Adicionando o produto ao carrinho
    cart.push(product);

    // Salvando o carrinho atualizado no localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    console.log(`${name} added to cart!`);

    // Substituindo o alert por uma notificação do Toastify
    Toastify({
      text: `${name} has been added to your cart.`,
      duration: 3000, // Duração da notificação em milissegundos
      close: true, // Botão de fechar
      gravity: "top", // "top" ou "bottom"
      position: "right", // "left", "center", "right"
      backgroundColor: "#4CAF50", // Cor do fundo (verde no exemplo)
      stopOnFocus: true, // Para a animação quando o usuário interagir
    }).showToast();
  });

  sessionProduct.append(div);
}

function filterSearch(letter) {
  if (data) {
    // Filtra os produtos que contêm o texto digitado
    const filtered = data.filter((item) =>
      item.name.toLowerCase().includes(letter)
    );

    // Limpa a tela antes de renderizar os resultados filtrados
    sessionProduct.innerHTML = "";

    // Renderiza os produtos filtrados
    filtered.forEach((item) =>
      loadsOnScreen(
        item.image,
        item.name,
        item.description,
        item.price,
        item // corrigi o uso aqui também
      )
    );
  }
}

inputSearch.addEventListener("input", (e) => {
  const letter = e.target.value.toLowerCase(); // Obtém o valor digitado
  if (letter === "") {
    sessionProduct.innerHTML = ""; // Limpa a tela
    loadingProduct(); // Recarrega todos os produtos se o campo de pesquisa estiver vazio
  } else {
    filterSearch(letter); // Filtra os produtos com base no texto digitado
  }
});

// Carrega os produtos inicialmente
loadingProduct();
