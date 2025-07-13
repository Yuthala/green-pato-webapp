import React, {useEffect, useState, useCallback} from "react";
import './ProductList.css';
import ProductItem from '../ProductItem/ProductItem';
import Header from './../../components/Header/Header';
import { useTelegram } from '../../hooks/useTelegram';

// TODO:Вынести в базу данных
// В description не более 4 строк текста на desktop
const products = [
	{id: '1', title: 'Картофель красный', price: 70, description: 'сорт Белароза. Вкусный, среднерассыпчатый, подходит как для супов, так и для салатов/вторых блюд', img: "img/potatoes.webp"},
	{id: '2', title: 'Лук репчатый', price: 60, description: 'сорт Штутгартер, классический желтый лук с выраженным острым вкусом', img: "img/onion.webp"},
	{id: '3', title: 'Чеснок', price: 200, description: 'Размер 3-5 см, разные сорта. Подходит для закруток и длительного хранения', img: "img/garlic.webp"},
	{id: '4', title: 'Кабачки цуккини', price: 50, description: 'Молодые цуккини с тонкой кожицей, молочными семенами и нежной мякотью', img: "img/zuccini.webp"},
	{id: '5', title: 'Лук шалот', price: 120, description: 'Разновидность салатного лука с нежным, полуострым вкусом. Луковицы небольшие.', img: "img/shalot.webp"},
	{id: '6', title: 'Огурец салатный', price: 80, description: 'Прекрасные вкусовые качества без горечи. Размер 10-12 см', img: "img/cucumber.webp"},
	{id: '7', title: 'Огурец соленый', price: 150, description: 'Хрустящие огурчики засолочного сорта бочкового соления с чесноком и укропом', img: "img/salted-cucumb.webp"}
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
				text: `Купить: ${getTotalPrice(newItems)} рублей`,
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
				text: `Купить: ${getTotalPrice(newItems)} рублей`,
				color: '#AD8945'
			})
		}
	};


	return (
		<>
			<Header />
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
		</>
	
	);
};

export default ProductList;
