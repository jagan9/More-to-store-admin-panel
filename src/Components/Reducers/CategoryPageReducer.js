const initState=null;


const categoryPageReducer=(state=initState,action)=>{

	switch(action.type){
		case "LOAD_PAGE":
		state={...state,[action.category]:action.payload};
		break;
		case "DELETE_PAGE":
		let newState=state;

		if(newState[action.payload]){
			delete newState[action.payload];
		}
		state= newState;
		
		break;
		default:
		break;
	}

	return state;
}



export default categoryPageReducer;