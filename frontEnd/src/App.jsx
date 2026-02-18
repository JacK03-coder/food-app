import AppRouters from "./routes/AppRouters"
import ThemeToggle from "./components/shared/ThemeToggle"

const App = () => {
  return (
    <div>
      <ThemeToggle />
      <AppRouters/>
    </div>
  )
}

export default App