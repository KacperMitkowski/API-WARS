export {data_handler}

// ==================================================================================================

const data_handler = {
  next_page: '',
  previous_page: '',
  request_starts_triggering: false,

  load_data: function (requested_url, callback) {
    const http_request = new XMLHttpRequest();
    http_request.open('GET', requested_url);
    http_request.onload = () => {
      const data = JSON.parse(http_request.response);

      data_handler.request_starts_triggering = true;
      if(data_handler.request_starts_triggering === true)
        callback(data);
    };
    http_request.send();
  }
};
