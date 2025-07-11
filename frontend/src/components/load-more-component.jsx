const LoadMoreDataBtn = ({ state, fetchDataFun }) => {
    if(state != null && state.totalDocs > state.results.length){

         return (
           <button onClick={() => fetchDataFun({ page: state.page + 1 })} 
           className="loadmore-btn">
            Load More
           </button>
        )
    }
  
}

export default LoadMoreDataBtn;