interface JQueryStatic {
  request: <T = any>(setting:JQueryAjaxSettings)=>JQuery.jqXHR<IJqueryAjaxResponse<T>>
}


interface IJqueryAjaxResponse<T = any> {
  code: number;
  data: T;
  developerMessage: string;
  message: string;
  successful: boolean
}

declare var layer = {
  title?: string,
  message: string
}
