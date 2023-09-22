const CAMERA_PATH: string = "http://localhost:4000/video_feed"
const SYSTEM_NAME = "Garita"
const VIEWS = [
  {pathName:"Inicio", path:"/dashboard/home", icon: "fa-solid fa-house"},
  {pathName:"Cámara", path:"/dashboard/camera", icon:"fa-solid fa-camera", blank:"_blank"},
  {pathName:"Vehiculos", path:"/dashboard/vehicles", icon:"fa-solid fa-car"},
  {pathName:"Choferes", path:"/dashboard/drivers" , icon:"fa-solid fa-users"},
  {pathName:"Roles", path:"/dashboard/roles", icon:"fa-solid fa-user-tie"},
  {pathName:"Registros", path:"/dashboard/registers", icon:"fa-solid fa-list"},
  /* {pathName:"Salir", path:"/dashboard/exit", icon:"fa-solid fa-arrow-right-from-bracket"}, */
]

const ROUTES_API = {
  access: "http://localhost:4000/get-access"
}

export {
  CAMERA_PATH,
  SYSTEM_NAME,
  VIEWS,
  ROUTES_API

}
