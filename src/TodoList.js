import {React, useState} from 'react'
import Todo from './Todo';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { Pagination, Stack } from '@mui/material'; 


const TodoList = ({todos, visibleTodos, toggleTodo, toggleSelect, handleDeleteSelected, handleOnSave,  ...props}) => {
  //todos.map((todo) => <Todo todo={todo} key={todo.id} toggleTodo={toggleTodo}/>);
  const [modal, setModal] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);

  const handlePurchaseFlagChange = (id) => {
    //購入フラグ変更
    toggleTodo(id);
  };
  
  const handleClearTodo = (id) => {
    //削除ボタンでリスト削除
    toggleSelect(id);
    handleDeleteSelected();
  }

  //ページネーション
    // 1ページあたりの表示数
    const ITEMS_PER_PAGE = 10; 
    const [page, setPage] = useState(1);

    const pageCount = Math.ceil(visibleTodos.length / ITEMS_PER_PAGE);

    const handlePageChange = (event, value) => {
      setPage(value);
    };

    const startItemIndex = (page - 1) * ITEMS_PER_PAGE;
    const paginatedTodos = visibleTodos.slice(startItemIndex, startItemIndex + ITEMS_PER_PAGE);



  return (
    <div className="ml-2">
        {/* todos.map((todo) => <Todo todo={todo} key={todo.id} toggleTodo={toggleTodo}/>); */}
        <div className="p-2 my-3 mr-2 bg-sky-400/75 text-white text-md font-semibold shadow-md">
          リスト
        </div>

        <Table responsive>
          <thead>
            {todos?.length === 0 && <div className="p-2 my-2 mx-2 text-gray-600 text-lg font-medium">※ リストがありません</div>}
            {todos?.length > 0 &&
              <tr>
                <th>ものの名前</th>
                <th>購入済 / 未購入</th>
                <th>金額</th>
                <th>買った日</th>
                <th>メモ</th>
                <th>詳細の追加/編集</th>
                <th></th>
              </tr>
            }   
          </thead>
          <tbody>
              {/* 検索結果なしとかの場合 */}
              {visibleTodos.length === 0 && <div className="p-2 my-2 mx-2 text-gray-600 text-lg font-medium">※ 条件に一致するリストがありません</div>}
              {/* {visibleTodos.map((todo) => { */}
              {paginatedTodos.map((todo) => {
                //<Todo todo={todo} key={todo.id} toggleTodo={toggleTodo}/>
                console.log('リストのreturnのtodo',todo);
                return(
                  <>
                    <tr>
                      <td>{todo.name}</td>
                      <td>{todo.purchasedFlag === false ? "未購入" : "購入済"}</td>
                      <td>{todo.amount}{todo.amount && "円"}</td>
                      <td>{todo.created_at}</td>
                      <td>{todo.memo}</td>
                      <td>
                        <Button variant="secondary" onClick={() => {
                          setSelectedTodo(todo);
                          setModal(true);
                        }}>詳細追加 / 編集
                        </Button>
                        
                        <Todo
                          show={modal}
                          onHide={() => setModal(false)}
                          visibleTodo={selectedTodo}
                          handleOnSave={handleOnSave}
                        />
                      </td>
                      <td>
                        <Button variant="success" className="mr-2" onClick={() => {handlePurchaseFlagChange(todo.id)}}>購入済 / 未購入</Button>
                        <Button variant="danger" onClick={() => {handleClearTodo(todo.id)}}>削除</Button>
                      </td>
                    </tr>
                  </>
                )
                }
              )}   
          
            
            {/* <tr>
              <td>1</td>
              {Array.from({ length: 12 }).map((_, index) => (
                <td key={index}>Table cell {index}</td>
              ))}
            </tr>
            <tr>
              <td>2</td>
              {Array.from({ length: 12 }).map((_, index) => (
                <td key={index}>Table cell {index}</td>
              ))}
            </tr>
            <tr>
              <td>3</td>
              {Array.from({ length: 12 }).map((_, index) => (
                <td key={index}>Table cell {index}</td>
              ))}
            </tr> */}
          </tbody>
        </Table>
        <Stack alignItems="center" marginTop={3}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={handlePageChange}
            shape="rounded"
            color="primary"
          />
        </Stack>
    </div>
  )
};

export default TodoList