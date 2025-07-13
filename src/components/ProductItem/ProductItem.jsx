import React, { useState }from "react";
import Button from "../Button/Button";
import './ProductItem.css';

	const ProductItem = ({ product, className, onAdd, onRemove })=> {
		let [count, setCount] = useState(0);

		const { img, title, description, price } = product;

		let handleIncrement = () => {
			setCount(count += 1);
			onAdd(product);
		}

		let handleDecrement = () => {
			setCount(count -= 1);
			onRemove(product);
		}

	return (
		<div className={'product' + className}>


			<div className={'img'}><img src={img}/></div>
			<div className={'title'}>{title}</div>
			<div className={'description'}>{description}</div>
			<div className={'price'}><span>Цена: <b>{price}</b> р/кг</span></div>

			{/* контейнер с кнопками + - */}
			<div className="btn-container">
				{/* кнопка - */}
				{/* {count === 0 ? (
				<Button title={'-'} type={'remove'} onClick={handleDecrement} />
				) : ""} */}
				{count > 0 ? (
					<Button title={'-'} type={'remove'} onClick={handleDecrement} />	
				) : ""}

				{/* поле с количеством */}
				<div className={`${count !== 0 ? "card__badge" : "card__badge--hidden"}`}>{count}</div>

				{/* кнопка + */}
				<Button title={'+'} type={'add'} onClick={handleIncrement} />
			</div>
		</div>
	)
};


export default ProductItem;