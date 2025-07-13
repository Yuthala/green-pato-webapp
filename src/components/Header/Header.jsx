import React from "react";
import Button from "../Button/Button";
import './Header.css';
import { useTelegram } from "../../hooks/useTelegram";

const Header = () => {

	// const {user, onClose} = useTelegram();

	return (
		<div className={'header'}>
			<h1>Вас приветствует Фермерское хозяйство Green&nbsp;Pato</h1>
			<img className="header-logo" src="img/logo.png" alt="logo" />
			<p>Предлагаем овощи высокого качества собственного производства с бесплатной доставкой</p>

			<div className="banner">
				<ul className="banner-list">
					<li>Бесплатная доставка по Тихорецку и Парковому</li>
					<li>Доставка по вторникам и субботам</li>
					<li>Наличная оплата или перевод на карту</li>
					<li>Скидка 5% постоянным клиентам</li>
				</ul>
			</div>
			{/* <Button onClick={onClose}>Закрыть</Button>
			<span className={'username'}>
				{user?.username}
			</span> */}
		</div>
	);
};

export default Header;