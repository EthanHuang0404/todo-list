import React, { useState, useEffect } from 'react';
import './App.css';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { db } from './firebase';
import { collection, addDoc, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore';

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [editTodoId, setEditTodoId] = useState(null);
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState('none');
  const [newGroupName, setNewGroupName] = useState('');

  useEffect(() => {
    const unsubscribeTodos = onSnapshot(collection(db, 'todos'), (snapshot) => {
      const todosData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTodos(todosData);
    });

    const unsubscribeGroups = onSnapshot(collection(db, 'groups'), (snapshot) => {
      const groupsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setGroups(prevGroups => [...prevGroups, ...groupsData]);
    });

    return () => {
      unsubscribeTodos();
      unsubscribeGroups();
    };
  }, []);

  const handleAddOrUpdateTodo = async () => {
    if (input.trim() === '') return;
  
    let groupId = selectedGroupId;
  
    // Handle adding a new group
    if (newGroupName.trim() !== '' && !groups.some(group => group.name === newGroupName)) {
      const groupRef = await addDoc(collection(db, 'groups'), { name: newGroupName });
      groupId = groupRef.id;
    }
  
    // Adding or updating a todo
    if (!editTodoId) {
      // Add a new todo
      await addDoc(collection(db, 'todos'), { todo: input, groupId });
    } else {
      // Update an existing todo
      await updateDoc(doc(db, 'todos', editTodoId), { todo: input, groupId });
    }
  
    // Reset fields
    setInput('');
    setNewGroupName('');
    setEditTodoId(null);
  };


  const handleEdit = (todo) => {
    setInput(todo.todo);
    setSelectedGroupId(todo.groupId);
    setEditTodoId(todo.id);
  };

  const handleRemoveTodo = async (id) => {
    await deleteDoc(doc(db, 'todos', id));
  };

  const handleRemoveGroup = async (groupId) => {
    // Remove the group
    await deleteDoc(doc(db, 'groups', groupId));
  
    // Remove todos associated with the group
    const todosToRemove = todos.filter(todo => todo.groupId === groupId);
    for (const todo of todosToRemove) {
      await deleteDoc(doc(db, 'todos', todo.id));
    }
  };
  
  return (
    <div className='min-h-screen flex flex-col items-center justify-center gap-4 p-4'>
      
      {/* Todo-list input area */}
      
      <div className='bg-gray-100 p-6 rounded shadow-md w-full max-w-lg'>
        <h1 className='text-3xl font-bold text-center mb-4'>Todo List</h1>
        <div className='flex flex-col gap-2'>
          <input 
            type="text" 
            placeholder='Add a new todo'
            className='py-2 px-4 border-2 rounded border-gray-300'
            value={input}
            onChange={(e) => setInput(e.target.value)} 
          />
          <div className='flex gap-2'>
            <select 
              value={selectedGroupId} 
              onChange={(e) => setSelectedGroupId(e.target.value)}
              className='border-2 rounded border-gray-300 flex-grow'
            >
              <option value="none">None</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>{group.name}</option>
              ))}
            </select>
            <input 
              type="text" 
              placeholder='Enter new group name'
              className='py-2 px-4 border-2 rounded border-gray-300 flex-grow'
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
            />
          </div>
          <button 
            onClick={handleAddOrUpdateTodo} 
            className='bg-gradient-to-r from-blue-400 to-blue-500 text-white py-2 px-4 rounded hover:from-blue-400 hover:to-blue-600'
          >
            {editTodoId == null ? <FaPlus /> : <FaEdit />}
          </button>
        </div>
      </div>

      {/* Render the grouped todos */}

      {groups.map((group) => (
        todos.some(todo => todo.groupId === group.id) && (
        <div key={group.id} className='bg-gray-100 p-6 rounded shadow-md w-full max-w-lg'>
          <h2 className='text-xl font-bold mb-4'>{group.name}</h2>

          <ul>
            {todos.filter(todo => todo.groupId === group.id).map((todo) => (
              <li key={todo.id} className='flex items-center justify-between bg-white p-3 rounded shadow-md mb-3'>
                <span className='text-lg'>{todo.todo}</span>
                <div>
                  <button onClick={() => handleEdit(todo)} className='mr-2 p-2 bg-gray-400 hover:bg-gray-500 text-white rounded'><FaEdit /></button>
                  <button onClick={() => handleRemoveTodo(todo.id)} className='mr-2 p-2 bg-red-400 hover:bg-red-500 text-white rounded'><FaTrash /></button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        )
      ))}
    </div>
  );
}

export default App;
