import { firestore } from "../../firebase";


export const loadCategories = (onSuccess, onError) => {
	return (dispatch, getState) => {
		firestore.collection("CATEGORIES").orderBy('index')
			.get().then((querySnapshot) => {
				let categories = [];
				if (!querySnapshot.empty) {
					querySnapshot.forEach((doc) => {
						categories.push(doc.data());
					});
					categories.sort((a, b) => a.index - b.index);
					dispatch({ type: "LOAD_CATEGORIES", payload: categories });
					onSuccess();
				}
			}).catch((err) => {
				console.log(err);
				onError();
			})
	};
};




export const addCategories = (data, onSuccess, onError) => {
	return (dispatch, getState) => {

		firestore
			.collection("CATEGORIES")
			.doc(data.categoryName.toUpperCase())
			.set(data)
			.then(function (doc) {
				dispatch({ type: "ADD_CATEGORY", payload: data });
				onSuccess();
			})
			.catch((err) => {
				console.log(err);
				onError();
			})
	};
};





export const updateCategories = (data, onSuccess, onError) => {
	return (dispatch, getState) => {

		firestore
			.collection("CATEGORIES")
			.doc(data.categoryName.toUpperCase())
			.update(data)
			.then(function (doc) {
				dispatch({ type: "UPDATE_CATEGORY", payload: data });
				onSuccess();
			})
			.catch((err) => {
				console.log(err);
				onError();
			})
	};
};





export const deleteCategories = (categoryName, onSuccess, onError) => {
	return (dispatch, getState) => {

		firestore
			.collection("CATEGORIES")
			.doc(categoryName.toUpperCase())
			.delete()
			.then(function (doc) {
				dispatch({ type: "DELETE_CATEGORY", payload: categoryName });
				dispatch({ type: "DELETE_PAGE", payload: categoryName });
				onSuccess();
			})
			.catch((err) => {
				console.log(err);
				onError();
			})
	};
};