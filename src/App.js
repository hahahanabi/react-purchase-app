import TodoList from "./TodoList";
import { useState ,useRef, useEffect } from "react";
import {v4 as uuidv4} from "uuid";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button'; 
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { ja } from 'date-fns/locale';
import { format } from 'date-fns';

function App() {
  const [toDos, setTodos] = 
  useState(() => {
    const savedTodos = localStorage.getItem("todoItems");
    console.log('ローアカルストレージから出してるsavedTodos',savedTodos);
    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  console.log('toDos中身',toDos);
  //表示用（検索かかったらこっちが動く）
  const [visibleTodos, setVisibleTodos] = useState([]);
  console.log('表示用データvisibleTodos',visibleTodos);
  const [radioValue, setRadioValue] = useState('all');
 console.log('radioValueの中身',radioValue);

  const [isOpen, setIsOpen] = useState(false);
  //リスト追加時、表示用に使用
  const [addTodoFlag, setAddTodoFlag] = useState(false);
  const todoNameRef = useRef();
  const todoSearchNameRef = useRef();
  //検索条件の名前があるかないかで使用↓
  const [todoSearchName, setTodoSearchName] = useState("");
console.log('検索窓の名前インプットset関数',todoSearchName);
console.log('検索窓の名前インプットRef',todoSearchNameRef);


  //日付
  //const initialDate = new Date()
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  //検索条件が入ってるか
  const [isSearchConditions, setIsSearchConditions] = useState(false);
  console.log('検索条件が１個でも入ってえるかset関数',isSearchConditions);
  //検索ボタンが押されたか（検索条件なし＋検索ボタン押下で１ページ目に戻る用）
  const searchFlagRef = useRef(false);
  console.log('searchFlagRef',searchFlagRef);
console.log('日付検索　最初の日付', startDate ? format(startDate, 'yyyy-MM-dd', { locale: ja }) : startDate);
console.log('日付検索　最後の日付', endDate ? format(endDate, 'yyyy-MM-dd', { locale: ja }) : endDate);


  useEffect(() => {
    console.log('visible変更');
    //表示用のデータに大元データセット（通常はこれ。リロード時）
    //購入フラグ変更ボタン押すと検索結果かわっちゃう（全部表示される）ので修正
    const isVisibleMatch = toDos.length === visibleTodos.length;
    console.log('見た目と元データのデータの数が一致してるか',isVisibleMatch);
    if (isVisibleMatch === true ||(visibleTodos.length === 0 && toDos.length !== 0)) {
      //全データと見た目データの数が一致する場合or画面リロード時（toDosデータあり、visibleデータなしの場合）はそのまま全データを表示
      setVisibleTodos(toDos);
    }
    if (isVisibleMatch === false && visibleTodos.length !== 0) {
      //画面読み込み時visibleの方は[]なので対応
      //一致しない場合は見た目の方で更新かかった方を表示したい（購入フラグとか変更後データ）のデータを表示させたい
      // 検索時（検索結果の）visibleのidと一致する、toDosのデータを絞り込んでvisibleにセット
      const visibleTodoIds = visibleTodos.map((todo => todo.id));
      setVisibleTodos(toDos.filter((todo) => visibleTodoIds.includes(todo.id)));
    }
    //リスト追加時
    if (addTodoFlag === true) {
      //見た目にも反映
      setVisibleTodos(toDos);
    }
  },[toDos])

  useEffect(() => {
    //検索条件が入ってるか
    console.log('検索条件のuseEffect');
    const conditionsArr = [todoSearchName, startDate, endDate, radioValue];
    const target = ["", null, null, "all"];
    const isEqual = JSON.stringify(conditionsArr) === JSON.stringify(target);
    
    console.log('isEqual',isEqual);
    console.log('conditionsArrの中身',conditionsArr);
    if (isEqual) {
      //検索条件なし
      setIsSearchConditions(false);
    } else {
      setIsSearchConditions(true);
    }
  },[todoSearchName, startDate, endDate, radioValue]);

  //検索ボタン以外押されたらfalseに制御
  useEffect(() => {
    const handleClick = () => {
      searchFlagRef.current = false;
    };

    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, []);

  //日付検索時の日付の選択
  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (endDate && date > endDate) {
      //終了日が開始日より前の日付が選ばれたら終了日リセット
      setEndDate(null);
    }
  }

  const handleEndDateChange = (date) => {
    setEndDate(date);
  }

  //検索条件ラジオボタン
  const radios = [
    { name: '全て', value: 'all' },
    { name: '購入済', value: 'purchased' },
    { name: '未購入', value: 'unpurchased' },
  ];
  const radioVariantColor = (value) => {
    if (value === 'all') return 'outline-secondary';
    if (value === 'purchased') return 'outline-success';
    if (value === 'unpurchased') return 'outline-danger';
  }

  const handleAddTOdo = () => {
    //タスク追加
    const name = todoNameRef.current.value;
    //からの名前のタスクは追加できないように追加
    if(name === "") return;
    setTodos((preveTodos) => {
    //追加の順番は新しく追加されたデータ▶︎前のデータ　で追加
      return [{id:uuidv4(), name:name, amount:null, created_at:null, memo:null, purchasedFlag:false, selected: false}, ...preveTodos];
    })
    todoNameRef.current.value = null;
    setAddTodoFlag(true);
  }

  const handleClearTodo = () => {
    //チェく入ってるタスクだけ削除
    const newTodos = toDos.filter((todo) => !todo.purchasedFlag);
    setTodos(newTodos);
  }

  const toggleTodo = (id) => {
    //複数タスクある場合どのタスクを完了状態にするか
    const newTodos = [...toDos];
    //todoはnewTodos の中の1つのオブジェクトの“住所（参照）” をそのままもらってる状態
    const todo = newTodos.find((todo) => todo.id === id);
    //なので、以下でnewTodos の中身が直接変えられる
    todo.purchasedFlag = !todo.purchasedFlag;
    setTodos(newTodos);
  };

  const toggleSelect = (id) => {
    //複数購入するものがある場合どのものを購入/未購入状態にするか
    const newTodos = [...toDos];
    //todoはnewTodos の中の1つのオブジェクトの“住所（参照）” をそのままもらってる状態
    const todo = newTodos.find((todo) => todo.id === id);
    //なので、以下でnewTodos の中身が直接変えられる
    todo.selected = !todo.selected;

    setTodos(newTodos);
  };

  const handleDeleteSelected = () => {
    //削除ボタン押したリストを削除（表示するデータに表示しないことで対応）
    const newTodos = toDos.filter((todo) => !todo.selected);
    setTodos(newTodos);
  };


  const handleSearchTodo = (e) =>  {
    console.log('検索処理');
      //どこかクリックされたときに上部のuseEffectで検索条件フラグfalseにするの防ぐため
    e.stopPropagation();
    if (!searchFlagRef.current) {
      //ただ初回検索条件入れずに検索ボタン押下時はtrueにならない、、
      searchFlagRef.current = true;
    }

    //検索処理 
    let filteredTodos = null;
    // 名前検索
    const searchName = todoSearchNameRef.current.value;
    console.log('検索名',searchName);
    if(!searchName && radioValue === 'all') {
      //検索値の名前に何も入ってない+購入フラグallの状態で検索してた場合は表示用setにそのまま最初のtoDosを入れる
      filteredTodos = toDos;
      // setVisibleTodos(toDos);
      // return;
    }

    //名前検索なし＋購入フラグで検索
    if (!searchName && radioValue !== 'all') {
      if (radioValue === 'purchased') {
        filteredTodos = toDos.filter((todo) => todo.purchasedFlag === true);
      }
      if (radioValue === 'unpurchased') {
        filteredTodos = toDos.filter((todo) => todo.purchasedFlag === false);
      }
    }

    //名前検索あり＋購入フラグで検索
      if (searchName) {
        //名前検索で絞り込み
        const filteredNameTodos = toDos.filter((todo) => todo.name.toLowerCase().includes(searchName.toLowerCase()));
        //購入フラグで絞り込み
        if (radioValue === 'all') {
          filteredTodos = filteredNameTodos;
        }
        if (radioValue === 'purchased') {
          filteredTodos = filteredNameTodos.filter((todo) => todo.purchasedFlag === true);
        }
        if (radioValue === 'unpurchased') {
          filteredTodos = filteredNameTodos.filter((todo) => todo.purchasedFlag === false);
        }
      }
console.log('条件あり検索filtertodo',filteredTodos);
    //日付検索
      let filterByDateTodos = null;
      if (startDate === null && endDate === null) {
        //日付選択なし
        setVisibleTodos(filteredTodos);
        //return;
      } 
      if (startDate !== null && endDate === null) {
        //最初の日付だけ 選択あり
        filterByDateTodos = filteredTodos.filter((todo) => todo.created_at !== null && new Date(todo.created_at) >= startDate);
      } 
      if (startDate === null && endDate !== null) {
        //最後の日付だけ 選択あり
        const endDateWithTime = new Date(endDate);
        endDateWithTime.setHours(23, 59, 59, 999);
        filterByDateTodos = filteredTodos.filter((todo) => todo.created_at !== null && new Date(todo.created_at) <= endDateWithTime);
      } 
      if (startDate !== null && endDate !== null) {
        //最初も最後も日付選択あり
        filterByDateTodos = filteredTodos.filter((todo) => {
          if (todo.created_at !== null) {
            const formatedDate = new Date(todo.created_at);
            const endDateWithTime = new Date(endDate);
            endDateWithTime.setHours(23, 59, 59, 999);
            return startDate <= formatedDate && endDateWithTime >= formatedDate;
          }
        });
      }

      if (filterByDateTodos !== null) {
        setVisibleTodos(filterByDateTodos);
      }
      //検索ボタンが押されたかどうか
    
    //ref初期化
    //検索直後消えちゃうから削除
    //todoSearchNameRef.current.value = null;
  }

  const handleOnSave = (updateTodo) => {
    console.log('Appの元の保存の関数の対象データ',updateTodo);
    //詳細ボタンで対象リスト編集、保存
   const updatedTodos = toDos.map((todo) => {
      if(todo.id === updateTodo.id) {
        return {
          ...todo,
          amount: updateTodo.amount,
          created_at: updateTodo.created_at,
          memo: updateTodo.memo,
        }
      }
      return todo;
    });
   console.log('Appの元の保存の関数updatedTodos',updatedTodos);

   setTodos(updatedTodos);
  }

  const handleSearchRequestClear = () => {
    //検索条件初期化
      //名前検索初期化
      todoSearchNameRef.current.value = null;
      setTodoSearchName("");
      //日付初期化
      setStartDate(null);
      setEndDate(null);
      //購入フラグ初期化
      setRadioValue('all');
  }

  useEffect(() => {
    //toDosが更新されたらローカルストレージに保存
    if (toDos) {
     localStorage.setItem("todoItems", JSON.stringify(toDos));
    }
  }, [toDos]);

 

  return (
    <>
    <div>
      <div className="bg-sky-500/75 text-white text-xl font-semibold p-4 my-4 rounded">
        買い物リスト
      </div>
      <input type="text" className="mx-4 px-3 py-1 border border-gray-300 focus:outline-none focus:ring-0 rounded-full text-lg" ref={todoNameRef}/>
      <button className="p-2 my-2 bg-sky-500 rounded-md text-lg text-sky-100 hover:bg-sky-600" onClick={handleAddTOdo}>買いたいものを追加</button>
      <div className="flex justify-end">
        <button className="p-2 my-2 mr-4 bg-gray-500 hover:bg-gray-600 rounded-md text-lg text-white" onClick={handleClearTodo}>購入済のリスト全削除</button>
      </div>

     {/* 検索 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="ml-3 flex items-center text-lg font-semibold px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
      >
        <span className="mr-2">{isOpen ? "−" : "＋"}</span> 検索条件
      </button>
      <div className={`${isOpen ? "block" : "hidden"} mt-1 ml-3 bg-white p-4 border border-blue-400 rounded shadow-md `}>
        <div className="p-1 text-gray-500 font-bold bg-sky-200 shadow-md ">リスト検索</div>
          <div className="flex items-center mt-3">
            <div className="mx-4 crayon-orange-g-narrow w-fit">名前検索</div>
            <input type="text" className=" mx-16 my-3 px-4 py-1 border border-gray-300 focus:outline-none focus:ring-0 rounded-full text-lg" ref={todoSearchNameRef} value={todoSearchName} onChange={(e) => setTodoSearchName(e.target.value)}></input>
          </div>
          <div className="flex items-center">
            <div className="mx-4 crayon-orange-g-narrow w-fit">買った日</div>
            <DatePicker
              locale={ja}
              selected={startDate}
              onChange={handleStartDateChange}
              dateFormat="yyyy-MM-dd"
              className="mx-16 my-3 px-4 py-1 border border-gray-300 focus:outline-none focus:ring-0 rounded-full text-lg"
            />
            <div className="font-bold"> ~ </div>
            <DatePicker
              locale={ja}
              selected={endDate}
              onChange={handleEndDateChange}
              minDate={startDate}
              dateFormat="yyyy-MM-dd"
              className="mx-16 my-3 px-4 py-1 border border-gray-300 focus:outline-none focus:ring-0 rounded-full text-lg"
            />
          </div>
          <div className="flex items-center mt-3">
            <div className="ml-6 mr-16 crayon-orange-g-narrow w-fit">購入or未購入</div>   
            <ButtonGroup>
              {radios.map((radio, idx) => (
                <ToggleButton
                  key={idx}
                  id={`radio-${idx}`}
                  type="radio"
                  variant={
                    radioVariantColor(radio.value)
                  }
                  name="radio"
                  value={radio.value}
                  checked={radioValue === radio.value}
                  onChange={(e) => setRadioValue(e.currentTarget.value)}
                >
                  {radio.name}
                </ToggleButton>

            ))}
            </ButtonGroup>
          </div>
          <div className="flex items-center justify-center">
            <div className="flex justify-center flex-1">
              <button 
                className="w-40 mt-4 px-2 py-1 text-center bg-sky-400 rounded-md text-lg text-white hover:bg-sky-500" 
                onClick={((e) => handleSearchTodo(e))}
                >
                検索
              </button>
            </div>
            <div className="w-40 flex justify-end">
              <button 
                className="px-2 py-1 mt-4 text-sky-500 hover:underline"
                onClick={handleSearchRequestClear}
                >
                条件クリア</button>
            </div>
          </div>
      </div>
     
      
      <div className="m-3 px-2 text-red-600 font-medium">※ 未購入のもの：{visibleTodos?.filter((todo) => !todo.purchasedFlag).length}</div>
      <TodoList todos={toDos} visibleTodos={visibleTodos} toggleTodo={toggleTodo} toggleSelect={toggleSelect} handleDeleteSelected={handleDeleteSelected
      } handleOnSave={handleOnSave} isSearchConditions={isSearchConditions} searchFlagRef={searchFlagRef.current}/>
    </div>
    </>
  );
}

export default App;
