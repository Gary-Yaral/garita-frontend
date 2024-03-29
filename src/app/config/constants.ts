const SERVER_CAMERA_PATH: string = "http://localhost:4500"
const CAMERA_PATH = `${SERVER_CAMERA_PATH}/video_feed`
const SYSTEM_NAME = "Garita"
const VIEWS = [
  {pathName:"Inicio", path:"/dashboard/home", icon: "fa-solid fa-house"},
  {pathName:"Cámara", path:"/dashboard/camera", icon:"fa-solid fa-camera", blank:"_blank"},
  {pathName:"Vehiculos", path:"/dashboard/vehicles", icon:"fa-solid fa-car"},
  {pathName:"Choferes", path:"/dashboard/drivers" , icon:"fa-solid fa-users"},
  {pathName:"Registros", path:"/dashboard/registers", icon:"fa-solid fa-list"},
  /* {pathName:"Salir", path:"/dashboard/exit", icon:"fa-solid fa-arrow-right-from-bracket"}, */
]

const ROLES = {
  SUPER: 'super',
  ADMINISTRATOR: 'administrador',
  USER: 'usuario',
}

const API_PATH = "http://localhost:5800"

const EXCEL_PATH = `${API_PATH}/excel/create`
const ROUTES_API = {
  login: `${API_PATH}/user/get-access`,
  user: `${API_PATH}/user`,
  vehicle: `${API_PATH}/vehicle`,
  driver: `${API_PATH}/driver`,
  register: `${API_PATH}/register`,
}

export {
  CAMERA_PATH,
  SYSTEM_NAME,
  VIEWS,
  API_PATH,
  EXCEL_PATH,
  ROUTES_API,
  SERVER_CAMERA_PATH,
  ROLES

}
