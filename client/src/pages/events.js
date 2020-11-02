import React, { useState, useRef } from "react";

import "./events.css";

import Modal from "../components/modal/modal";
import Backdrop from "../components/backdrop/backdrop";

const EventsPage = () => {
	const [startCreating, setStartCreating] = useState(false);

	const titleRef = useRef();
	const priceRef = useRef();
	const descriptionRef = useRef();
	const dateRef = useRef();

	const handleStartCreatingHandler = () => setStartCreating(!startCreating);

	const modalConfirmHandler = async () => {
		setStartCreating(!startCreating);

		const title = titleRef.current.value;
		const date = dateRef.current.value;
		const price = +priceRef.current.value;
		const description = descriptionRef.current.value;

		console.log(price);

		if (
			title.trim().length === 0 ||
			date.trim().length === 0 ||
			description.trim().length === 0
		) {
			return alert("Invalid Event Input");
		}

		const requestBody = {
			query: `
          mutation {
            createEvent(eventInput: {title: "${title}", description: "${description}", price: ${price}, date: "${date}"}) {
              _id
              title
              description
              date
              price
              creator {
                _id
                email
              }
            }
          }
        `,
		};

		try {
			const token = localStorage.getItem("token");

			const createdEvent = await fetch("http://localhost:4000/graphql", {
				method: "POST",
				body: JSON.stringify(requestBody),
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + token,
				},
			});

			console.log(createdEvent);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
			{startCreating && <Backdrop />}
			{startCreating && (
				<Modal
					title='Add Event'
					canCancel
					canConfirm
					onCancel={handleStartCreatingHandler}
					onConfirm={modalConfirmHandler}>
					<form>
						<div className='form-control'>
							<label htmlFor='title'>Title</label>
							<input type='text' id='title' ref={titleRef} />
						</div>
						<div className='form-control'>
							<label htmlFor='price'>price</label>
							<input type='number' id='price' ref={priceRef} />
						</div>
						<div className='form-control'>
							<label htmlFor='date'>date</label>
							<input type='datetime-local' id='date' ref={dateRef} />
						</div>
						<div className='form-control'>
							<label htmlFor='description'>description</label>
							<textarea id='textarea' rows='4' ref={descriptionRef} />
						</div>
					</form>
				</Modal>
			)}

			<div className='events-control'>
				<p>share your own Events!</p>
				<button className='btn' onClick={handleStartCreatingHandler}>
					Create Event
				</button>
			</div>
		</>
	);
};

export default EventsPage;
