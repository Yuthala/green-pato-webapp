import GlobalHook from "use-global-hook";
import * as actions from "./actions";

const initialState = {
  
	//user_name: "",
	//user_role: "user",
	// здесь перечислите все переменные которые должны быть глобальными
	// можете задать им значния по умолчанию
	products: [
		{id: '1', title: 'Картофель', price: 75, description: 'сорт Импала, кг', img: "img/potatoes.jpg"},
		{id: '2', title: 'Томаты', price: 150, description: 'сорт Розовые, кг', img: "img/tomatoes.jpg"},
		{id: '3', title: 'Баклажаны', price: 80, description: 'сорт Алмаз, кг', img: "img/eggplant.jpg"},
		{id: '4', title: 'Огруцы', price: 120, description: 'сорт ТСХ, 600 г', img: "img/cucumber.jpg"}
	],
	totalPrice: 0,
	//queryId,
  };
  
  const useGlobal = GlobalHook( initialState, actions );
  
  export default useGlobal;