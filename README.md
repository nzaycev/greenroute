<h4>Реализованная функциональность</h4>
<ul>
    <li>Геокодинг в видимой области</li>
    <li>Геопозиция (имитация для отдаленных регионов)</li>
    <li>Построение наилучшего маршрута от текущего местоположения до найденного места</li>
    <li>Тепловая карта, основанная на статистических данных</li>
</ul> 
<h4>Особенность проекта в следующем:</h4>
<ul>
 <li>Учет индекса качества воздуха в построении маршрута;</li>
 <li>Киллерфича-2;</li>
 <li>Киллерфича-3;</li>  
 </ul>
<h4>Основной стек технологий:</h4>
<ul>
  <li>ReactNative expo-cli</li>
	<li>Python Django server</li>
	<li>PostgreSQL database</li>
	<li>React Web version</li>
	<li>Gulp, Webpack, Babel.</li>
	<li>Git.</li>
  
 </ul>
<h4>Демо</h4>
<p>Демо версия приложения доступна по адресу: <a href="https://snack.expo.dev/@n.zaycev/amused-candy" target="_blank">expo snack</a> </p>
<p>Демо версия веб версии приложения доступна по адресу: <a href="https://greenway5.herokuapp.com/" target="_blank">heroku app</a> </p>


СРЕДА ЗАПУСКА
------------
1) развертывание сервиса производится на любой desktop платформе. Предпочтительно Mac OS (Для сборки iOS версии приложения);
2) требуется установленный <a href="https://nodejs.org/en/" target="_blank">node.js</a>;
3) требуется установленная среда <a href="https://reactnative.dev/docs/environment-setup" target="_blank">React Native expo-cli</a>;
4) требуется установленный менеджер пакетов <a href="https://yarnpkg.com/getting-started/install" target="_blank">Yarn</a> для node.js;


УСТАНОВКА
------------
### Клонирование репозитория

Выполните 
~~~
git clone https://github.com/nzaycev/greenroute/
~~~

### Установка зависимостей проекта
Выполните
~~~
cd greenroute
yarn
~~~
### Сборка

Для windows следующие команды начинаются с 'npx'
~~~
expo run:[android|ios] # сборка и запуск на эмуляторе или поключенном устройстве
expo start # запуск интерфейса expo-cli для отладки
~~~

РАЗРАБОТЧИКИ

<h4>Зайцев Николай fullstack https://vk.com/stievorx </h4>

