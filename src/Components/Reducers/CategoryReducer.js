const initState=null;


const categoryReducer=(state=initState,action)=>{

	switch(action.type){
		case "LOAD_CATEGORIES":
		state=action.payload;
		break;
		case "ADD_CATEGORY":
		state=[...state,action.payload];
		break;
		case "UPDATE_CATEGORY":
		let list=[...state];

		let index=state.indexOf(
			list.filter(
				(item)=>item.categoryName === action.payload.categoryName
				)[0]
			);

		list[index]=action.payload;
		state=list;
		break;
		case "DELETE_CATEGORY":
		let list1=[...state];

		let index1=state.indexOf(
			list1.filter(
				(item)=>item.categoryName === action.payload
				)[0]
			);

		list1.splice(index1,1);
		state=list1;


		break;
		default:
		break;
	}

	return state;
}



export default categoryReducer;