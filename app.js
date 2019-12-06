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

    this.chargerPanier()
  },
  data : {
    produits : [],
    panier : [],
    total : 0,
    commandeValid:false,
  },
  methods : {
    calculPanierTtlPanier(){
      let ttl = 0;
      this.panier.forEach((produit) => {
        ttl += (produit.qte * produit.prix)
      })
      this.total = ttl;
    },
    chargerPanier(){
      axiosWrapper.get("cart").then((response) => {
        this.panier = response.data;
        this.calculPanierTtlPanier();
      })
    },
    ajouterPanier(produit) {
      axiosWrapper.post("cart/"+produit.id).then((response) => {
        this.panier = response.data;
        this.calculPanierTtlPanier();
      })
    },
    enleverProduitPanier(produit){
      axiosWrapper.delete("cart/"+produit.id).then((response) => {
        this.panier = response.data;
        this.calculPanierTtlPanier();
      })
    },
    emptyCart(){
      axiosWrapper.delete("cart");
      this.panier = [];
      this.total = 0;
    },
    commander(){
      this.chargerPanier()
      let produit_valid = 0;
      this.panier.forEach((produit,i) => {
        axiosWrapper.put("cart/"+produit.id+"/buy").then((response) => {
          this.panier[i].ok = true;
          produit_valid++;
          if (produit_valid === this.panier.length){
            this.commandeValid = true;
          }
        })
      })
    }
  }
});