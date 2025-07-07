import React, {useEffect, useState, useCallback} from "react";
import './ProductList.css';
import ProductItem from '../ProductItem/ProductItem';
import { useTelegram } from '../../hooks/useTelegram';

// TODO:Вынести в базу данных
const products = [
	{id: '1', title: 'Картофель', price: 75, description: 'сорт Импала, кг', img: "img/potatoes.jpg"},
	{id: '2', title: 'Томаты', price: 150, description: 'сорт Розовые, кг', img: "img/tomatoes.jpg"},
	{id: '3', title: 'Баклажаны', price: 80, description: 'сорт Алмаз, кг', img: "img/eggplant.jpg"},
	{id: '4', title: 'Огурцы', price: 120, description: 'сорт ТСХ, 600 г', img: "img/cucumber.jpg"},
	{id: '5', title: 'Лук', price: 60, description: 'сорт Штутгартер, 1 кг', img: "img/cucumber.jpg"}
]

// Подсчёт стоимости всех товаров в массиве с учётом количества
const getTotalPrice = (items = []) => {
	return items.reduce((acc, item) => {
		return acc += item.price * item.quantity;
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

	
	const onSendData = useCallback(() => {
		// alert('On send data')
        const data = {
            products: addedItems,
            totalPrice: getTotalPrice(addedItems),
            // queryId,
        }
		
		//1.3 Вызов функции передачи объекта в Telegram 
       tg.sendData(JSON.stringify(data));
    }, [products, getTotalPrice(addedItems)]);

	useEffect( ()=> {
		tg.onEvent('mainButtonClicked', onSendData)
			return ()=> {
				tg.offEvent('mainButtonClicked', onSendData)
			}
		}, [onSendData])

	

	//КОРЗИНА

	const onRemove = (product) => {
		const alreadyAdded = addedItems.find((item) => item.id === product.id);
		let newItems =[];

		if (alreadyAdded.quantity === 1) {
			newItems = addedItems.filter((item) => item.id !== product.id);
		} else {
			newItems = addedItems.map((item) => 
				item.id === product.id ? {...alreadyAdded, quantity: alreadyAdded.quantity - 1} : item
			)
		}

		setAddedItems(newItems)

		if(newItems.length === 0) {
			tg.MainButton.hide();
		} else {
			tg.MainButton.show();
			tg.MainButton.setParams({
				text: `Купить ${getTotalPrice(newItems)}`,
				color: '#AD8945'
			})
		}
	};


	const onAdd = (product) => {
		const alreadyAdded = addedItems.find((item) => item.id === product.id);
		let newItems =[];

		if (alreadyAdded) {
			newItems = addedItems.map((item) => 
					item.id === product.id ? {...alreadyAdded, quantity: alreadyAdded.quantity + 1} : item
				)
		} else {
			newItems = [...addedItems, {...product, quantity: 1}];
		};

	setAddedItems(newItems);

		if(newItems.length === 0) {
			tg.MainButton.hide();
		} else {
			tg.MainButton.show();
			tg.MainButton.setParams({
				text: `Купить ${getTotalPrice(newItems)}`,
				color: '#AD8945'
			})
		}
	};


	return (
		<div className={'list'}>
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
