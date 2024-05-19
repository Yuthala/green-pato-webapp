import React, {useEffect, useState, useCallback} from "react";
import './Form.css';
import { useTelegram } from "../../hooks/useTelegram";



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

	//1.7 Валидация формы
	//Состояние, отражающее был ли активен input
	// const [nameDirty, setNameDirty] = useState(false)
	// const [phoneDirty, setPhoneDirty] = useState(false)
	// const [addressDirty, setStreetDirty] = useState(false)
	//Состояние, отражающее наличие ошибки
	const [nameError, setNameError] = useState('Поле не может быть пустым')
	const [phoneError, setPhoneError] = useState('Поле не может быть пустым')
	const [streetError, setStreetError] = useState('Поле не может быть пустым')


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
    }, [name, street, phone])

	useEffect( ()=> {
		tg.onEvent('mainButtonClicked', onSendData)
			return ()=> {
				tg.offEvent('mainButtonClicked', onSendData)
			}
		}, [onSendData])

	// 1.4 Установка текста и цвета для Главной кнопки
	useEffect( () => {
		tg.MainButton.setParams( {
			text: 'Отправить данные',
			color: '#AD8945'
		})
	}, [])

	// 1.5 Отслеживание значений в элементах Формы, чтобы показать или скрыть Главную кнопку
	useEffect( () => {
		if(nameError || phoneError || streetError) {
			tg.MainButton.hide();
		} else {
			tg.MainButton.show();
		}
	}, [nameError, phoneError, streetError])

	//Действия с кнопкой 
	// const blurHandler = (e) => {
	// 	switch (e.target.name) {
	// 		case "name":
	// 			setNameDirty(true);
	// 			break;
	// 		case "phone":
	// 			setPhoneDirty(true);
	// 			break;
	// 		case "street":
	// 			setStreetDirty(true);
	// 			break;
	// 	}
	// }

	// 1.6 Обработка изменения значения объектов в Форме
	const onChangeName = (e) => {
		setname(e.target.value);
		const re = /^[А-Яа-яЁё\s]+$/;
		// return re.test(String(name).toLowerCase());

		//если то что находится в инпуте в данный момент не соответствует регулярному выражению > текст ошибки
		if(!re.test(String(e.target.value).toLowerCase())) {
			setNameError('Только русские буквы')
		} else {
			setNameError('')
		}
	}

	const onChangePhone = (e) => {
		setPhone(e.target.value);
		const re = /(?:\+|\d)[\d\-\(\) ]{9,}\d/g;

		if(!re.test(String(e.target.value).toLowerCase())) {
				setPhoneError('Введите номер мобильного телефона')
		} else {
			setPhoneError('')
		}


	}

	const onChangeStreet= (e) => {
		setStreet(e.target.value);
		const re = /^[?!,.а-яА-ЯёЁ0-9\s]+$/;

		if(!re.test(String(e.target.value).toLowerCase())) {
			setStreetError('Допустимы русские буквы, цифры, знаки препинания')
		} else {
			setStreetError('')
		}
	}

	//1.8 Отрисовка Формы на странице
	return (
		<div className={"form"}>
			<h3>Введите ваши данные</h3>
			<h4>необходимо заполнить все поля</h4>

			{/* //если поле name активировано и в нем есть ошибка, выводим сообщение об ошибке пользователю */}
			{(nameDirty && nameError) && <div className="warning">{nameError}</div>}
			<input 
				name="name"
				className={'input'} 
				type="text" 
				placeholder={'Ваше имя'}
				maxLength="20" 
				value={name}
				onChange={e => onChangeName(e)}
				// onBlur={e => blurHandler(e)}
			/>
{/* 
			//если поле phone активировано и в нем есть ошибка, выводим сообщение об ошибке пользователю */}
			{(phoneDirty && phoneError) && <div className="warning">{phoneError}</div>}
			<input 
			name="phone"
				className={'input'} 
				type="phone" 
				placeholder={'Телефон'}
				maxLength="18"
				value={phone}
				onChange={e => onChangePhone(e)}
				// onBlur={e => blurHandler(e)}
			/>

			{/* //если поле address активировано и в нем есть ошибка, выводим сообщение об ошибке пользователю */}
			{(addressDirty && addressError) && <div className="warning">{addressError}</div>}
			<input
				name="street"
				className={'input'} 
				type="text" 
				placeholder={'Адрес'}
				maxLength="100"
				value={street}
				onChange={e => onChangeStreet(e)}
				// onBlur={e => blurHandler(e)}
			/>
		</div>
	);
};

export default Form;