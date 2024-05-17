import React, {useEffect, useState, useCallback} from "react";
import './Form.css';
import { useTelegram } from "../../hooks/useTelegram";
//import { orderCartData } from '../../hooks/CustomerData';
//import { cartData } from "../ProductList/ProductList";



// 1 Создание объекта "Форма(Form)"
const Form =() => {

	//  1.1 Костанты для отслеживания состояния объектов ... с использованием useState()
	// Объект name из формы
	const [name, setname] = useState('');
	// Объект street из формы
	const [street, setStreet] = useState('');
	// Объект phone из формы
	const [phone, setPhone] = useState('');
	// Объект tg
	const {tg} = useTelegram();

	// 1.2 Передача данных в Telegram
    const onSendData = useCallback(() => {
		// Объект для передачи в Telegram
	
        let data = {
            name,
            street,
            phone,
        };
		
		// 1.3 Вызов функции передачи объекта в Telegram 
        tg.sendData(JSON.stringify(data));
    }, [name, street, phone]) // TODO - Зачем нужен массив в useCallBack??

	useEffect( ()=> {
		tg.onEvent('mainButtonClicked', onSendData)
			return ()=> {
				tg.offEvent('mainButtonClicked', onSendData)
			}
		}, [onSendData])

	// 1.4 Установка текста для Главной кнопки
	useEffect( () => {
		tg.MainButton.setParams( {
			text: 'Отправить данные',
			color: '#AD8945'
		})
	}, [])

	// 1.5 Отслеживание значений в элементах Формы, чтобы показать или скрыть Главную кнопку
	useEffect( () => {
		if(!street || !name || !phone) {
			tg.MainButton.hide();
		} else {
			tg.MainButton.show();
		}
	}, [name, street])

	// 1.6 Как обработать изменение значения объектов в Форме
	const onChangeName = (e) => {
		setname(e.target.value)
	}

	const onChangeStreet= (e) => {
		setStreet(e.target.value)
	}

	const onChangePhone = (e) => {
		setPhone(e.target.value)
	}

	// Отрисовка Формы на странице
	return (
		<div className={"form"}>
			<h3>Введите ваши данные</h3>

			<input 
				className={'input'} 
				type="text" 
				placeholder={'Ваше имя'}
				pattern="[A-Za-zА-Яа-яЁё]{3,20}"
				maxlength="20" 
				value={name}
				onChange={onChangeName}
				required
			/>
			<input 
				className={'input'} 
				type="phone" 
				placeholder={'Телефон'}
				pattern="[0-9]{5,11}"
				maxlength="11"
				value={phone}
				onChange={onChangePhone}
				required
			/>

			<input
				className={'input'} 
				type="text" 
				placeholder={'Адрес'}
				pattern="[а-яА-ЯёЁa-zA-Z0-9]{6,100}"
				maxlength="100"
				value={street}
				onChange={onChangeStreet}
				required
			/>
{/* 
			<select value={phone} onChange={onChangephone} className={'select'}>
				<option value={'physical'}>Физ. лицо</option>
				<option value={'legal'}>Юр. лицо</option>
			</select> */}
		</div>
	);
};

export default Form;