import {React, useEffect, useState, useRef} from 'react';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { ja } from 'date-fns/locale';
import { format } from 'date-fns';



const Todo = ({visibleTodo, toggleTodo, show, onHide, handleOnSave}) => {
  // const handleTodoClick = () => {
  //   toggleTodo(todo.id);
  // };
  console.log('モーダルにきてるvisibleToso',visibleTodo);
  //日付
  //const initialDate = new Date()
  const [startDate, setStartDate] = useState(null);
console.log('setの選択した日付',startDate);
  useEffect(() => {
    //選択したリストのデータの初期表示
    if (visibleTodo === null) {
      //画面リロードとかした場合のエラー回避
      return;
    } else {
      console.log('日付あるデータ',new Date(visibleTodo.created_at));
      //DatePickerに渡すselectedはdate型じゃないとダメなんだって
      setStartDate(visibleTodo.created_at ? new Date(visibleTodo.created_at) : visibleTodo.created_at);
    }
  },[visibleTodo]);
 

  const handleDateChange = (date) => {
    //日付変更
    setStartDate(date)
  
  }

  //入力
  const amountRef = useRef();
  const memoRef = useRef();

  console.log('モーダルにきたvisibleTodo', visibleTodo);

  const handleSave = () => {
    //保存
    const amount = amountRef.current.value;
    console.log('保存時撮ってきたamount',amount);
    console.log('保存時撮ってきた日付',startDate);
    console.log('保存時撮ってきた日付 整形版',format(startDate, 'yyyy-MM-dd'));


    visibleTodo.amount = amount;
    //日付選択してnullに戻した場合に他の日付が表示されちゃうバグを修正
    visibleTodo.created_at = startDate !== null ? format(startDate, 'yyyy-MM-dd', { locale: ja }) : null;
    visibleTodo.memo = memoRef.current.value;
console.log('リストの編集時保存時のvisibleTodo',visibleTodo);
    handleOnSave(visibleTodo);
    amountRef.current.value = null;
    memoRef.current.value = null;
    onHide(); // モーダル閉じる
  };

  return (
    <>
      <div>
        {/* <label>
          <input type="checkbox" checked={todo.completed} onChange={handleTodoClick}/>
          <button>完了</button>
        </label>
        {todo.name} */}
      </div>
       <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>リスト情報追加 / 編集</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* 画面リロードしたらnameない言われてエラー出たから */}
          <div className="mb-1 py-1 bg-sky-200 font-bold text-xl text-center shadow-lg rounded-md">{visibleTodo?.name}</div>
            <div className="flex-1 bg-gray-100 p-6">
            <div className="crayon-orange-g-narrow p-2 w-fit">金額</div>
            <div className="flex">
              <input
                defaultValue={visibleTodo?.amount}
                type="number"
                ref={amountRef}
                className="form-control my-2"
                style={{ width: "8rem" }}
              />
              <div className="pt-3 px-2">円</div>
            </div>
            <div className="crayon-orange-g-narrow p-2 w-fit">買った日</div>
            <DatePicker
              locale={ja}
              selected={startDate}
              onChange={handleDateChange}
              dateFormat="yyyy-MM-dd"
              className="form-control my-2"
            />
            <div className="crayon-orange-g-narrow p-2 w-fit">メモ</div>
            <input
              defaultValue={visibleTodo?.memo}
              type="text"
              ref={memoRef}
              className="form-control my-2"
            />
         </div> 
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>キャンセル</Button>
        <Button variant="primary" onClick={handleSave}>保存</Button>
      </Modal.Footer>
    </Modal>
    </>
  )
}

export default Todo