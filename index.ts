import {
  Observable,
  from,
  of,
  map,
  fromEvent,
  reduce,
  switchMap,
  debounceTime,
  distinctUntilChanged,
} from 'rxjs';
import { ajax } from 'rxjs/ajax';

// 1 创建创建Observable对象
const observable = new Observable(function subscribe(subscriber) {
  const id = setInterval(() => {
    subscriber.next('hi');
  }, 1000);
  return () => {
    clearInterval(id);
  };
});

// 最常见的是 Observable 是使用创建函数创建的，例如 of、from、interval 等。
const observable2 = from([10, 20, 30]);

// 2、创建 observer
const observer = {
  next: (x) => console.log('Observer got a next value: ' + x),
  error: (err) => console.error('Observer got an error: ' + err),
  complete: () => console.log('Observer got a complete notification'),
};

const observer2 = {
  next: (x) => console.log('Observer got a next value: ' + x),
  error: (err) => console.error('Observer got an error: ' + err),
};

const observer3 = (value) => console.log(value);

// 3、demo

function getBingSuggestions(term) {
  return new Observable((subscriber) => {
    const url = `http://api.bing.com/qsonhs.aspx?q=${encodeURIComponent(term)}`;
    const script = document.createElement('script');
    script.src = `${url}&JsonType=callback&JsonCallback=JSONP_CALLBACK`;
    window.JSONP_CALLBACK = (data) => {
      console.log(11111);
      subscriber.next(data);
      subscriber.complete();
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
      window.JSONP_CALLBACK = null;
    };
  });
}

document.body.innerHTML =
  '<div><input id="inputBox" /><div id="container"></div></div>';

const typeahead = fromEvent(document.getElementById('inputBox'), 'input').pipe(
  map((e: Event) => (e.target as HTMLInputElement).value),
  debounceTime(500), // 添加延迟, 防抖
  distinctUntilChanged(), // 过滤相同的输入值
  switchMap((val) => getBingSuggestions(val))
);

// 订阅 Observable
typeahead.subscribe((data: any) => {
  console.log(data);
});
