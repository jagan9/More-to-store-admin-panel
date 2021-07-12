import { firestore } from "../../firebase";


export const loadCategoryPage = (category, onSuccess, onError) => {
	return (dispatch, getState) => {



		firestore.collection("CATEGORIES").doc(category)
			.collection("TOP_DEALS").orderBy("index")
			.get().then((querySnapshot) => {
				let pageData = [];
				if (!querySnapshot.empty) {
					querySnapshot.forEach((doc) => {
						pageData.push({ id: doc.id, ...doc.data() });
					});


				}
				dispatch({ type: "LOAD_PAGE", payload: pageData, category: category });
				onSuccess();
			}).catch((err) => {
				console.log(err);
				onError();
			})
	};
};