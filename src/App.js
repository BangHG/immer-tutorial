import React, { useRef, useCallback, useState } from 'react';
import produce from 'immer'; //불변성 maker
import NotImmer from './notImmer';
const App = () => {
  const nextId = useRef(1);
  const [form, setForm] = useState({ name: '', username: '' });
  const [data, setData] = useState({
    array: [],
    uselessValue: null,
  });

  // 이런식으로  전개연산자 무한제공사건을 간략하게 줄여 업데이트 시킬 수 있다.
  const onChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm(
      produce((draft) => {
        draft[name] = value;
      })
    );
  }, []);

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const info = {
        id: nextId.current,
        name: form.name,
        username: form.username,
      };
      // array 에 새 항목 등록
      setData(
        produce((draft) => {
          draft.array.push(info);
        })
      );
      // form 초기화
      setForm({
        name: '',
        username: '',
      });
      nextId.current += 1;
    },
    [form.name, form.username]
  );

  const onRemove = useCallback((id) => {
    setData(
      produce((draft) => {
        draft.array.splice(
          draft.array.findIndex((info) => info.id === id),
          1
        );
      })
    );
  }, []);

  return (
    <div style={{ fontFamily: '나눔스퀘어', padding: '1em', margin: '0', fontWeight: '500', fontSize: '1.5em', display: 'flex', gap: '10px' }}>
      <div>
        <h2>Immer</h2>
        <form onSubmit={onSubmit} style={{ display: 'flex' }}>
          <input name="username" placeholder="아이디" value={form.username} onChange={onChange} />
          <input name="name" placeholder="이름" value={form.name} onChange={onChange} />
          <button type="submit" style={{ flex: '0 0 auto' }}>
            등록
          </button>
        </form>
        <div>
          <ul>
            {data.array.map((info) => (
              <li key={info.id} onClick={() => onRemove(info.id)}>
                {info.username} ({info.name})
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <h2>Not Immer</h2>
        <NotImmer></NotImmer>
      </div>
    </div>
  );
};

export default App;

