'use strict';

let axiosWrapper = (function() {
  let endpoint = "https://tools.sopress.net/iut/panier/api/";
  let token = "devuono2u@etu.univ-lorraine.fr";
  function setUrl(uri) {
    if(uri.indexOf('?')>-1) {
      uri+= '&'
    } else {
      uri+= '?'
    }
    return endpoint + uri + "token=" + encodeURIComponent(token);
  }
  return {
    get(uri) {
      return axios.get(setUrl(uri))
    },
    post(uri) {
      return axios.post(setUrl(uri))
    },
    put(uri) {
      return axios.put(setUrl(uri))
    },
    delete(uri) {
      return axios.delete(setUrl(uri))
    },
  };
})();

var app = new Vue({
  el :'#app',
  mounted() {
    axiosWrapper.get("products").then((response) => {
      this.produits = response.data;
    })

    axiosWrapper.get("cart").then((response) => {
      this.panier = response.data;
    })
  },
  data : {
    produits : [],
    panier : [],
    total : 0,
  },
  methods : {
    ajouterPanier(produit) {
      axiosWrapper.post("cart/"+produit.id).then((response) => {
        this.panier = response.data;
      })
    },
    enleverProduitPanier(produit){
      axiosWrapper.delete("cart/"+produit.id).then((response) => {
        this.panier = response.data;
      })
    },
    emptyCart(){
      axiosWrapper.delete("cart");
      this.panier = [];
    }
  }
});