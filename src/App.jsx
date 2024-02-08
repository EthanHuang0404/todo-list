import React, { useState, useEffect } from 'react';
import './App.css';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { db } from './firebase';
import { collection, deleteDoc, doc, onSnapshot, updateDoc, addDoc } from 'firebase/firestore';


function App() {
  
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState(''); 
  const [editIndex, setEditIndex] = useState(-1); 
 
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'todos'), (snapshot) =>{
      setTodos(snapshot.docs.map((doc) => ({id: doc.id, todo: doc.data().todo})));
    });

  return () => unsubscribe();
}, []);

  const addTodo = async () => {
    try {
      if (input.trim() !== '') {
        await addDoc(collection(db, 'todos'), { todo: input });
        setInput('');
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const setEdit = (index) => {
    setInput(todos[index].todo);
    setEditIndex(index);
  };
  const updateTodo = async () => { // <-- Make sure this function is declared with `async`
    try {
      if (input.trim() !== '') {
        const todoDocref = doc(db, 'todos', todos[editIndex].id);
        await updateDoc(todoDocref, { todo: input });
        // Reset edit state
        setInput('');
        setEditIndex(-1);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const removeTodo = async (id) => {
    try {
      await deleteDoc(doc(db, 'todos', id));
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className='min-h-screen flex flex-col items-center justify-center gap-4 p-4'>
      <div className='bg-gray-100 p-6 rounded shadow-md w-full max-w-lg lg:w-1/4'>
        <h1 className='text-3xl font-bold text-center mb-4'>Todo List</h1>
        <div className='flex'>
          <input 
            type="text" 
            placeholder='Add a new todo'
            className='py-2 px-4 w-full border-2 rounded border-gray-300 mr-2'
            value={input}
            onChange={(e) => setInput(e.target.value)} 
          />
          <button onClick={editIndex === -1 ? addTodo : updateTodo} className='bg-gradient-to-r from-blue-400 to-blue-500 text-white py-2 px-4 rounded hover:from-blue-400 hover:to-blue-600'>
          {editIndex === -1 ? <FaPlus /> : <FaEdit />}
          </button>
        </div>
      </div>
      {
        todos.length > 0 &&(
          <div className='bg-gray-100 p-6 rounded shadow-md w-full max-w-lg lg:w-1/4'>
          <ul>
            {todos.map((item, index) => ( 
              <li key={item.id + index} className='flex items-center justify-between bg-white p-3 rounded shadow-md mb-3'> 
                <span className='text-lg'>{item.todo}</span> 
                <div>
                  <button onClick={() => setEdit(index)} className='mr-2 p-2 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded hover:from-gray-400 hover:to-gray-600'><FaEdit /></button>
                  <button onClick={() => removeTodo(item.id)} className='mr-2 p-2 bg-gradient-to-r from-red-400 to-red-500 text-white rounded hover:from-red-400 hover:to-red-600'><FaTrash /></button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        )
      }
    </div>
  );
}

export default App;
