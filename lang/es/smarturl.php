<?php
// This file is part of Moodle - https://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <https://www.gnu.org/licenses/>.

/**
 * Spanish language strings for mod_smarturl.
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

$string['addmetatype'] = 'Guardar campo';
$string['addparamdef'] = 'Guardar variable';
$string['adminconfiglink'] = 'Configuración de Smart URL';
$string['adminconfigsubtitle'] = 'Gestiona las categorías, los campos y las variables de URL del sitio.';
$string['adminconfigtitle'] = 'Configuración de Smart URL';
$string['appearance'] = 'Apariencia';
$string['archivecategoryfields'] = 'Conservar los campos inactivos';
$string['aspectratio_help'] = 'Determina la forma del marco del contenido incrustado.';
$string['categories'] = 'Categorías';
$string['category'] = 'Categoría';
$string['category_deleted'] = 'Categoría eliminada.';
$string['category_name'] = 'Nombre de la categoría';
$string['categorysort'] = 'Orden de aparición';
$string['choose'] = 'Elige un campo';
$string['clear_search'] = 'Borrar búsqueda';
$string['clearfilters'] = 'Quitar filtros';
$string['completioncompact'] = 'Requisitos de finalización';
$string['completionstatus'] = 'Finalización';
$string['confirmdelete'] = '¿Eliminar la definición «{$a}»? Puedes desactivarla para conservar su configuración.';
$string['constantvalue'] = 'Valor fijo';
$string['course_card'] = 'Tarjeta';
$string['course_image'] = 'Solo imagen';
$string['course_link'] = 'Enlace';
$string['courseappearance'] = 'Vista en el curso';
$string['coursefieldsmode'] = 'Detalles en el curso';
$string['createcategory'] = 'Añadir categoría';
$string['datatype_badge'] = 'Insignia';
$string['datatype_boolean'] = 'Sí o no';
$string['datatype_date'] = 'Fecha';
$string['datatype_duration'] = 'Duración';
$string['datatype_json'] = 'Datos estructurados';
$string['datatype_list'] = 'Lista';
$string['datatype_multiline'] = 'Texto largo';
$string['datatype_number'] = 'Número';
$string['datatype_tags'] = 'Etiquetas';
$string['datatype_text'] = 'Texto';
$string['datatype_url'] = 'Dirección web';
$string['defaultappearance'] = 'Valores de presentación';
$string['defaultappearance_desc'] = 'Preseleccionados en las actividades nuevas. El profesor puede cambiarlos y las actividades existentes conservan sus valores.';
$string['defaultcategory'] = 'General';
$string['defaultpopupheight'] = 'Alto predeterminado de la ventana emergente (px)';
$string['defaultpopupwidth'] = 'Ancho predeterminado de la ventana emergente (px)';
$string['defaultwindowsize'] = 'Tamaño de la ventana';
$string['defaultwindowsize_desc'] = 'Se usa con **Ventana del visor** y **Ventana externa**.';
$string['deferred_preview'] = 'El recurso se carga cuando alguien lo abre.';
$string['delete_fields'] = 'Se conservan los valores. Los de los campos ocultos siguen ocultos.';
$string['delete_variables'] = 'Los enlaces que usan esta variable dejarán de recibir su valor.';
$string['deletecategoryheading'] = '¿Eliminar {$a}?';
$string['deletecategoryinfo'] = 'Esta categoría contiene {$a} campos. Elige qué hacer con ellos.';
$string['deliveryfailed'] = 'No se pudo servir el archivo remoto.';
$string['deliveryhosts'] = 'Servidores de archivos autorizados';
$string['deliveryhosts_desc'] = 'Escribe un nombre de servidor HTTPS exacto por línea. Autoriza únicamente orígenes de confianza que sirvan archivos.';
$string['deliveryinvalid'] = 'Usa una URL de archivo compatible alojada en un servidor HTTPS autorizado.';
$string['deliverypreview'] = 'Moodle carga el archivo protegido después de guardar la actividad.';
$string['deliveryretired'] = 'Este modo ya no está disponible. Pide a un editor que actualice la actividad.';
$string['deliveryretired_edit'] = 'Esta actividad usaba la entrega desde el servidor. Selecciona Cargar al hacer clic y guarda para publicarla con el nuevo modo.';
$string['disabled'] = 'Desactivado';
$string['duplicatecategory'] = 'Ya existe una categoría con este nombre.';
$string['duplicateschemaitem'] = 'Este nombre ya está en uso.';
$string['durationseconds_help'] = 'Duración en segundos, si corresponde al recurso.';
$string['dynamicparams'] = 'Variables de URL';
$string['dynamicparams_help'] = 'Inserta una variable en el enlace o envía un valor como parámetro.';
$string['emptycategories'] = 'Aún no hay categorías';
$string['emptycategories_text'] = 'Las categorías agrupan los campos del recurso en el formulario de la actividad y en la página del recurso.';
$string['emptyfields'] = 'Aún no hay campos del recurso';
$string['emptyfields_text'] = 'Los campos describen cada recurso, como su autor o su nivel.';
$string['emptymetadata'] = 'No hay resultados';
$string['emptymetadata_hint'] = 'Cambia la búsqueda o quita los filtros.';
$string['emptyresults'] = 'No hay resultados';
$string['emptyresults_text'] = 'Prueba con otras palabras o quita los filtros.';
$string['emptyvariables'] = 'Aún no hay variables de URL';
$string['emptyvariables_text'] = 'Las variables añaden datos del curso, del usuario o del sitio a los enlaces de las actividades.';
$string['eventresourceopened'] = 'Recurso de Smart URL abierto';
$string['externalurl'] = 'Enlace';
$string['externalurl_help'] = 'Introduce la dirección del recurso. Puedes insertar variables o añadir parámetros de URL más abajo.';
$string['fieldmode_default'] = 'Usar valores por defecto';
$string['fieldmode_none'] = 'Ocultar detalles';
$string['fieldmode_select'] = 'Elegir campos';
$string['fieldselection'] = 'Campos en orden de aparición';
$string['fieldselection_help'] = 'Escribe las claves de los campos separadas por comas y en el orden en que quieres que aparezcan.';
$string['fieldsmode'] = 'Vista de metadatos';
$string['fieldsmode_help'] = 'Muestra los campos predeterminados, oculta los detalles o elige qué campos estarán disponibles.';
$string['groupname'] = 'Categoría';
$string['invalidmetadata'] = 'Introduce un valor válido para el tipo de campo {$a}.';
$string['invalidplugin'] = 'Esta extensión de Smart URL no está instalada.';
$string['launch_activity'] = 'Página de la actividad';
$string['launch_auto'] = 'Automático';
$string['launch_external'] = 'Sitio externo';
$string['launch_externaltab'] = 'Pestaña externa';
$string['launch_externalwindow'] = 'Ventana externa';
$string['launch_inline'] = 'Dentro del curso';
$string['launch_viewertab'] = 'Pestaña del visor';
$string['launch_viewerwindow'] = 'Ventana del visor';
$string['lockedbadge'] = 'Protegido';
$string['managedbadge'] = 'Gestionado por una integración';
$string['manageplugins'] = 'Extensiones de Smart URL';
$string['manageplugins_help'] = 'Activa o desactiva las extensiones instaladas y abre sus ajustes.';
$string['mediaheader'] = 'Imagen de portada';
$string['meta_addmore'] = 'Añadir campo';
$string['meta_customkey'] = 'Campo personalizado';
$string['meta_value'] = 'Valor';
$string['metadataheading'] = 'Detalles del recurso';
$string['metadatasection'] = 'Detalles del recurso';
$string['metadatasection_help'] = 'Añade datos como autor, idioma o formato. Elige dónde aparecen en Apariencia.';
$string['metadatatypes'] = 'Campos del recurso';
$string['modulename'] = 'Smart URL';
$string['modulename_help'] = 'Añade un enlace a una web, un vídeo, un audio o un documento. Elige cómo se abre y añade detalles del recurso.';
$string['modulenameplural'] = 'Smart URL';
$string['morepages'] = 'Más ajustes de Smart URL';
$string['movecategoryfields'] = 'Mover los campos a';
$string['nav_audio'] = 'Audio';
$string['nav_image'] = 'Imagen';
$string['nav_video'] = 'Vídeo';
$string['newfield'] = 'Añadir campo';
$string['newvariable'] = 'Añadir variable';
$string['nopluginsinstalled'] = 'No hay extensiones de Smart URL instaladas.';
$string['nopluginsinstalled_text'] = 'Las extensiones son plugins de Moodle que se instalan dentro de Smart URL, como reproductores o tipos de metadatos.';
$string['nosmarturls'] = 'Aún no hay enlaces avanzados en este curso.';
$string['openactivity'] = 'Abrir recurso';
$string['openexternal'] = 'Abrir en el sitio externo';
$string['openresource'] = 'Abrir en otra pestaña';
$string['pagerange'] = '{$a->from}–{$a->to} de {$a->total}';
$string['pagerlabel'] = 'Elementos por página';
$string['param_addmore'] = 'Añadir parámetro';
$string['param_choose'] = 'Elige una variable';
$string['param_insert_tokens'] = 'Insertar variable';
$string['param_preview'] = 'Vista previa del enlace';
$string['param_queryname'] = 'Nombre del parámetro';
$string['param_remove'] = 'Quitar fila';
$string['param_staticvalue'] = 'Valor fijo';
$string['paramdefs'] = 'Variables de URL';
$string['playresource'] = 'Reproducir recurso';
$string['pluginname'] = 'Smart URL';
$string['policylocknotice'] = 'Campos gestionados ({$a->managedby}) · {$a->fields}';
$string['poster_auto'] = 'Automática';
$string['poster_none'] = 'Sin imagen';
$string['poster_provider'] = 'Imagen del proveedor';
$string['poster_upload'] = 'Imagen subida';
$string['poster_url'] = 'URL de imagen';
$string['posterimage'] = 'Subir imagen';
$string['presentation_course'] = 'Vista en el curso';
$string['presentation_course_desc'] = 'Cómo aparece la actividad en la página del curso.';
$string['presentation_course_help'] = 'Cómo aparece la actividad en la página del curso.

* **Enlace**: el enlace estándar de la actividad.
* **Tarjeta**: portada con los detalles debajo.
* **Solo imagen**: solo la portada, sin nombre ni icono.';
$string['presentation_deferred'] = 'Cargar al hacer clic';
$string['presentation_deferred_help'] = 'El navegador recibe la dirección cuando alguien abre el recurso. Desactiva esta opción para cargar los recursos incrustados al entrar.';
$string['presentation_description'] = 'Mostrar la descripción';
$string['presentation_description_help'] = 'Muestra la descripción en el curso además de en el visor.';
$string['presentation_gateway'] = 'Proteger la dirección de origen';
$string['presentation_gateway_help'] = 'Moodle obtiene un archivo compatible desde un servidor HTTPS autorizado y lo sirve desde la actividad. La dirección original queda en los ajustes.';
$string['presentation_icon'] = 'Mostrar el icono';
$string['presentation_icon_help'] = 'Muestra el icono del tipo junto al título en el curso.';
$string['presentation_launch'] = 'Abrir en';
$string['presentation_launch_desc'] = 'Qué ocurre al seleccionar la actividad.';
$string['presentation_launch_help'] = 'Qué ocurre al seleccionar la actividad.

* **Automático**: la página de la actividad si puede mostrar el recurso; si no, el sitio externo.
* **Página de la actividad**: la página de Smart URL dentro del curso.
* **Pestaña del visor**: el visor de Smart URL, sin la navegación del curso, en una pestaña nueva del navegador.
* **Ventana del visor**: el visor de Smart URL en una ventana emergente.
* **Sitio externo**: la dirección del recurso en la misma pestaña, en lugar de la página del curso.
* **Pestaña externa**: la dirección del recurso en una pestaña nueva del navegador.
* **Ventana externa**: la dirección del recurso en una ventana emergente.
* **Dentro del curso**: debajo de la actividad en la página del curso.';
$string['presentation_play'] = 'Mostrar un botón de reproducción sobre la imagen';
$string['presentation_play_help'] = 'Muestra el botón de reproducción sobre la portada de audios y vídeos.';
$string['presentation_poster'] = 'Origen de la portada';
$string['presentation_poster_desc'] = 'Imagen de portada en la página del curso y en el visor.';
$string['presentation_poster_help'] = 'Imagen de portada.

* **Automática**: imagen subida, después URL de imagen, después imagen del proveedor.
* **Imagen subida** o **URL de imagen**: se indican en cada actividad.
* **Imagen del proveedor**: la miniatura del vídeo, por ejemplo de YouTube.
* **Sin imagen**: sin portada.

Las copias privadas y la carga al hacer clic solo usan una imagen subida.';
$string['presentation_protected'] = 'Servir una copia privada';
$string['presentation_protected_help'] = 'Sube un PDF, imagen, audio o vídeo para servirlo desde Moodle. La dirección de origen queda en la configuración de la actividad. También puedes subir una portada.';
$string['presentation_title'] = 'Mostrar el título';
$string['presentation_title_help'] = 'Muestra el título sobre la tarjeta en el curso.';
$string['presentation_viewer'] = 'Vista del visor';
$string['presentation_viewer_desc'] = 'Cómo muestra el recurso la página de Smart URL.';
$string['presentation_viewer_help'] = 'Cómo muestra el recurso la página de Smart URL.

* **Automático**: incrusta multimedia, imágenes y PDF; enlaza las demás páginas web.
* **Incrustado**: lo incrusta todo, también páginas web. Algunos sitios lo bloquean.
* **Portada con botón**: el recurso se carga al seleccionar la portada.
* **Enlace externo**: solo un botón para abrir el recurso.
* **Ventana de diálogo**: el recurso se abre en un diálogo.

No se usa cuando **Abrir en** va al sitio externo.';
$string['preset'] = 'Aplicar un preajuste';
$string['preset_document'] = 'Documento';
$string['preset_video'] = 'Vídeo';
$string['preset_weblink'] = 'Enlace web';
$string['previewactivity'] = 'En la actividad';
$string['previewauxiliary'] = 'Visor auxiliar';
$string['previewcourse'] = 'En el curso';
$string['previewcurrentlanguage'] = 'Idioma actual';
$string['previewmobile'] = 'Vista móvil';
$string['previewpending'] = 'Preparando la vista previa…';
$string['previewresource'] = 'Vista previa';
$string['protectedfile'] = 'Archivo del recurso';
$string['protectedmissing'] = 'Sube un archivo compatible para servir una copia privada.';
$string['resourceinformation'] = 'Información del recurso';
$string['savecategory'] = 'Guardar categoría';
$string['savefailed'] = 'No se pudieron guardar los cambios. Inténtalo otra vez.';
$string['schemaintro'] = 'Define las categorías, los campos y las variables que los docentes pueden usar en las actividades Smart URL.';
$string['searchfields'] = 'Buscar un campo';
$string['searchvariables'] = 'Buscar una variable';
$string['select_empty'] = 'No hay opciones que coincidan';
$string['select_search'] = 'Buscar opciones';
$string['selectcategory'] = 'Elige una categoría';
$string['selectresource'] = 'Elegir un recurso';
$string['settingscatalogue_help'] = 'Gestiona las categorías, los campos de metadatos y las variables de URL.';
$string['shortname'] = 'Clave';
$string['source_builtin'] = 'Datos de Moodle';
$string['source_course_custom_field'] = 'Campo personalizado del curso';
$string['source_static'] = 'Valor fijo';
$string['source_user_profile_field'] = 'Campo personalizado del perfil';
$string['subplugintype_smarturlmeta'] = 'Tipo de metadato de Smart URL';
$string['subplugintype_smarturlmeta_plural'] = 'Tipos de metadato de Smart URL';
$string['subplugintype_smarturlplayer'] = 'Reproductor de Smart URL';
$string['subplugintype_smarturlplayer_plural'] = 'Reproductores de Smart URL';
$string['subplugintype_smarturlsource'] = 'Catálogo de Smart URL';
$string['subplugintype_smarturlsource_plural'] = 'Catálogos de Smart URL';
$string['testresolution'] = 'Probar enlace';
$string['thumbnailurl'] = 'URL de la imagen';
$string['thumbnailurl_help'] = 'Introduce la dirección de la imagen si la portada usa una URL.';
$string['translate'] = 'Traducciones';
$string['translationdescription'] = 'Descripción traducida';
$string['translationhint'] = 'Deja un campo en blanco para usar el texto original.';
$string['translationlanguage'] = 'Idioma que quieres editar';
$string['translationtitle'] = 'Título traducido';
$string['usemimeicons'] = 'Usar iconos del tipo de archivo';
$string['usemimeicons_desc'] = 'Muestra iconos de Moodle para tipos reconocidos, como PDF o audio.';
$string['variable_cm_id'] = 'ID de la actividad';
$string['variable_course_category'] = 'ID de la categoría del curso';
$string['variable_course_format'] = 'Formato del curso';
$string['variable_course_fullname'] = 'Nombre completo del curso';
$string['variable_course_id'] = 'ID del curso';
$string['variable_course_idnumber'] = 'Número de identificación del curso';
$string['variable_course_lang'] = 'Idioma del curso';
$string['variable_course_shortname'] = 'Nombre corto del curso';
$string['variable_site_shortname'] = 'Nombre corto del campus';
$string['variable_site_url'] = 'Dirección del campus';
$string['variable_user_email'] = 'Correo del usuario';
$string['variable_user_firstname'] = 'Nombre';
$string['variable_user_id'] = 'ID del usuario';
$string['variable_user_idnumber'] = 'Número de identificación del usuario';
$string['variable_user_lang'] = 'Idioma del usuario';
$string['variable_user_lastname'] = 'Apellidos';
$string['variable_user_roles'] = 'Roles del usuario';
$string['variable_user_username'] = 'Nombre de usuario';
$string['viewdetails'] = 'Ver detalles';
$string['viewer_auto'] = 'Automático';
$string['viewer_embed'] = 'Incrustado';
$string['viewer_link'] = 'Enlace externo';
$string['viewer_modal'] = 'Ventana de diálogo';
$string['viewer_poster'] = 'Portada con botón';
$string['viewerappearance'] = 'Visor del recurso';
$string['viewerfieldsmode'] = 'Detalles en el visor';
$string['visibility_hidden'] = 'Oculto';
$string['visibility_primary'] = 'Destacado';
$string['visibility_secondary'] = 'Normal';
$string['windowdimensions'] = 'Tamaño de la ventana';
$string['windowdimensions_help'] = 'Tamaño inicial en píxeles para **Ventana del visor** y **Ventana externa**.';
