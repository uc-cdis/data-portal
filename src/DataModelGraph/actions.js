import { fetchWrapper } from '../actions';
import { submissionapi_path } from '../localconf';

/**
 * getCounts: Compose and send a single graphql query to get a count of how 
 *    many of each node and edge are in the current state
 */
export const getCounts = (type, project, dictionary) => {
  let query = "{";

  type.forEach((element) => {
    if (element !== "program") {
      append_count_to_query(element);
    }
  });

  let nodes_to_hide = ["program"];
  console.log("dictionary: " + dictionary);
  for (var val in dictionary) {
    if (!val.startsWith("_") && dictionary[val].links) {
      for (let i = 0; i < dictionary[val].links.length; i++) {
        if (dictionary[val].links[i].target_type) {
          if (nodes_to_hide.includes(dictionary[val].links[i].target_type) || nodes_to_hide.includes(val)) {
            continue;
          }
          append_link_to_query(val, dictionary[val].links[i].target_type, dictionary[val].links[i].name);
        }
        if (dictionary[val].links[i].subgroup) {
          for (let j = 0; j < dictionary[val].links[i].subgroup.length; j++) {
            if (dictionary[val].links[i].subgroup[j].target_type) {
              if (nodes_to_hide.includes(dictionary[val].links[i].subgroup[j].target_type) || nodes_to_hide.includes(val)) {
                continue;
              }
              append_link_to_query(val, dictionary[val].links[i].subgroup[j].target_type, dictionary[val].links[i].subgroup[j].name);
            }
          }
        }
      }
    }
  };

  query = query.concat("}");
  return fetchWrapper({
    path: submissionapi_path + 'graphql',
    body: JSON.stringify({
      'query': query 
    }),
    method: 'POST',
    handler: receiveCounts
  });

  function append_count_to_query(element) {
    if (element !== "metaschema" && !element.startsWith('_')) {
      query = query + `_${element}_count (project_id:\"${project}\"),`;
    }
  }
  function append_link_to_query(source, dest, name) {
    if (source !== "metaschema" && !source.startsWith('_')) {
      query = query + `${source}_to_${dest}_link: ${source}(with_links: [\"${name}\"], first:1, project_id:\"${project}\"){submitter_id},`;
    }
  }
};

export const clearCounts = () => {
  return {
    type: 'CLEAR_COUNTS'
  }
};

let receiveCounts = ({status, data}) => {
  switch (status){
    case 200:
      return {
        type: 'RECEIVE_COUNTS',
        data: data.data
      };
    default:
      return {
        type: 'FETCH_ERROR',
        error: data.data
      }
  }
};
