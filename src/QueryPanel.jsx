//import {memo} from 'react'
function Querypanel(props) {
  const { onChange } = props;
  return (
     <div id="optionsDiv" className="esri-widget">
      <p>Select a query type and click a point on the map to view the results.</p>
      <select id="query-type" onChange={onChange} className="esri-widget">
        <option value="basic">Basic Query</option>
        <option value="distance">Query By Distance</option>
      </select>
    </div>
  )
}
export default Querypanel