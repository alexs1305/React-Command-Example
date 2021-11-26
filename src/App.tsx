import "./styles.css";
import { createContext, useContext, useState } from "react";

type AppContext = {
  names: string[];
};
const defaultValue = {
  names: ["John", "Jane"]
};

const appContext = createContext<{
  state: AppContext;
  updateState: (state: AppContext) => void;
}>({} as any);

interface Command<TRequest> {
  action: (request: TRequest) => (state: AppContext) => AppContext;
}

class AddNameCommand implements Command<{ name: string }> {
  action = ({ name }: { name: string }) => (state: AppContext) => ({
    ...state,
    names: [...state.names, name]
  });
}

function useCommand<TRequest>(command: Command<TRequest>) {
  const { state, updateState } = useContext(appContext);
  return (request: TRequest) => {
    updateState(command.action(request)(state) as any);
  };
}

const NamesList: React.FC = () => {
  const {
    state: { names }
  } = useContext(appContext);
  const addCommand = useCommand(new AddNameCommand());
  return (
    <>
      Names:
      {names.map((n) => (
        <li>{n}</li>
      ))}
      <button onClick={() => addCommand({ name: "new" })}>Click to add</button>
    </>
  );
};

export default function App() {
  const [state, updateState] = useState(defaultValue);

  return (
    <appContext.Provider value={{ state, updateState }}>
      <div className="App">
        <h1>Hello CodeSandbox</h1>
        <h2>Start editing to see some magic happen!</h2>
      </div>
      <NamesList />
    </appContext.Provider>
  );
}
