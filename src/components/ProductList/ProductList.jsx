import React, {useEffect, useState, useCallback} from "react";
import './ProductList.css';
import ProductItem from '../ProductItem/ProductItem';
import { useTelegram } from '../../hooks/useTelegram';
//import Button from './../Button/Button';
//import { orderCartData } from '../../hooks/CustomerData';
// import Form from './../Form/Form';
//import useStore from "use-global-hook";



// TODO:Вынести в базу данных
const products = [
	{id: '1', title: 'Картофель', price: 75, description: 'сорт Импала, кг', img: "img/potatoes.jpg"},
	{id: '2', title: 'Томаты', price: 150, description: 'сорт Розовые, кг', img: "img/tomatoes.jpg"},
	{id: '3', title: 'Баклажаны', price: 80, description: 'сорт Алмаз, кг', img: "img/eggplant.jpg"},
	{id: '4', title: 'Огруцы', price: 120, description: 'сорт ТСХ, 600 г', img: "img/cucumber.jpg"}
]

// Подсчёт стоимости всех товаров в массиве с учётом количества
const getTotalPrice = (items = []) => {
	return items.reduce((acc, item) => {
		return acc += item.price
	}, 0)
}

//  1 Создание объекта Product list(Список Товаров)
const ProductList = () => {

	// 1.1 Константы для отслеживания состояния объектов
	// Отслеживается объект addedItems
	const [addedItems, setAddedItems] = useState([]);
	// Отслеживание объекта tg 
	const {tg, queryId} = useTelegram();


	// const onSendData = useEffect(() => {
	// 	alert('On send data')
    //     const data = {
    //         products: addedItems,
    //         totalPrice: getTotalPrice(addedItems),
    //         queryId,
    //     }
		
	// 	//1.3 Вызов функции передачи объекта в Telegram 
    //    tg.sendData(JSON.stringify(data));
    // }, [products, getTotalPrice(addedItems)]);


	const onSendData = () => {
		alert('On send data')
        const data = {
            products: addedItems,
            totalPrice: getTotalPrice(addedItems),
            queryId,
        }
		
		//1.3 Вызов функции передачи объекта в Telegram 
       tg.sendData(JSON.stringify(data));
    };


// debugging alert
	// useEffect(()=> {
	// 	// const data = {
    //     //     products: addedItems,
    //     //     totalPrice: getTotalPrice(addedItems),
    //     //     queryId
    //     // }

	// 	// alert(`My data products: ${data.products}, price: ${data.totalPrice}, queryId: ${data.queryId}`)

	// 	tg.MainButton.onClick(onSendData)
	// })

	// useEffect( ()=> {
	// 	tg.onEvent('mainButtonClicked', function() {
	// 		window.location.href = "https://green-pato-test.greenpato.ru/form"
	// 	})
	// })


	useEffect( ()=> {
		tg.onEvent('mainButtonClicked', onSendData)
			return ()=> {
				tg.offEvent('mainButtonClicked', onSendData)
			}
		}, [onSendData])

	

	//КОРЗИНА
	//функция увеличения количества товара в корзине
		const increase = (product) => {

			// setAddedItems((addedItems) => {
			// 	return addedItems.map((product) => {
			// 		if (product.id === id) {
			// 			return {
			// 				...product,
			// 					count: product.count + 1,
			// 			};
			// 		}
			// 		return product;
			// 	})
			// })
		}

	//функция уменьшения количества товара в корзине
	const decrease = (product) => {

		// setAddedItems((addedItems) => {
		// 	return addedItems.map((product) => {
		// 		if (product.id === id) {;

		// 			return {
		// 				...product,
		// 					count: product.count - 1 < 1 ? product.count - 1 : 1,
		// 			};
		// 		}
		// 		return product;
		// 	})
		// })
	}

	// const onAdd = (product) => { // TODO: Add Count Increase Decrease logic
	// 	const alreadyAdded = addedItems.find(item => item.id === product.id);
	// 	let newItems = [];
		
	// 	if(alreadyAdded) {
	// 		//newItems = addedItems.filter(item => item.count += 1);
	// 	const foundItem = addedItems.find(function(item) {
	// 		return item.id === product.id
	// 	})
	// 	foundItem.count += 1
	// 	newItems = addedItems

	// 	} else {
	// 		newItems = [...addedItems, product];
	// 	}

	const onAdd = (product) => {
		const alreadyAdded = addedItems.find((item) => item.id === product.id);
		let newItems =[];

		if (alreadyAdded) {
			newItems = addedItems.map((item) => 
					item.id === product.id ? {...alreadyAdded, quantity: alreadyAdded.quantity + 1} : item
				)
		} else {
			newItems = [...addedItems, {...product, quantity: 1}];
		}

		console.log(addedItems.length);

		setAddedItems(newItems)

		if(newItems.length === 0) {
			tg.MainButton.hide();
		} else {
			tg.MainButton.show();
			tg.MainButton.setParams({
				text: `Купить ${getTotalPrice(newItems)}`
			})
		}
	};


	const onRemove = (product) => {
		
	};


	return (
		<div className={'list'}>
			{/* <Button onClick={onSendData}>Тест</Button> */}
			{products.map(product => (
				<ProductItem
					product={product}
					key={product.id}
					onAdd={onAdd}
					onRemove={onRemove}
					className={'item'}
				/>
			))}
		</div>
	);
};

export default ProductList;