# Solicitud funcional: administración de negocios gratuitos desde cuenta gratuita

## 1. Contexto

Actualmente, seccionamarilla.com permite que negocios no publicados puedan incorporarse al portal mediante la funcionalidad **Registra tu empresa**. A través de este flujo, el usuario captura información básica del negocio, se genera un negocio gratuito dentro del portal y posteriormente se inicia un proceso operativo de validación y enriquecimiento de información. 

El portal funciona principalmente como un directorio digital orientado a la visibilidad, búsqueda, descubrimiento de negocios y facilitación de contacto entre usuarios finales y negocios publicados. Su modelo actual no contempla autocontratación de productos, pagos en línea ni gestión comercial directa desde el portal. 

También se ha identificado que la calidad y actualización del contenido publicado depende en gran medida de procesos internos, ya que actualmente el cliente o propietario del negocio no cuenta con autogestión completa de su información desde el portal. 

Con base en lo anterior, se requiere proponer un nuevo flujo funcional que permita que los usuarios que registran negocios gratuitos puedan regresar posteriormente al portal, iniciar sesión y administrar la información de sus negocios desde una sección privada.

---

## 2. Objetivo de la funcionalidad

Habilitar una experiencia de administración para usuarios con **cuenta gratuita**, permitiéndoles consultar, crear, editar, publicar, cambiar a no publicado o eliminar lógicamente los negocios gratuitos asociados a su cuenta.

La funcionalidad busca mejorar la experiencia del usuario propietario o administrador de un negocio gratuito, permitiéndole mantener actualizada su información de manera independiente, así como contribuir a una mejor calidad y frescura del contenido publicado en el portal.

---

## 3. Enfoque del mock solicitado

El mock que se requiere generar no debe enfocarse en diseño visual, UI final, estilos gráficos ni componentes definitivos.

El objetivo del mock es representar el **flujo funcional de navegación**, considerando:

* Puntos de entrada.
* Secuencia de pantallas.
* Estados del negocio.
* Decisiones del usuario.
* Acciones disponibles.
* Confirmaciones.
* Mensajes funcionales clave.
* Reglas de transición entre estados.

El mock debe servir como propuesta funcional para presentar la posible implementación del nuevo módulo o funcionalidad dentro del portal.

---

## 4. Alcance funcional de la primera fase

La primera fase contempla únicamente la administración de **negocios gratuitos** creados desde:

1. El flujo público actual de **Registra tu empresa**.
2. La sección privada **Mis Negocios**, una vez que la cuenta gratuita ya existe.

No aplica para negocios asociados a productos pagados, clientes comerciales vigentes ni funcionalidades existentes del flujo actual de **Mi Negocio / Ya soy cliente**. Los negocios pagados continuarán siendo gestionados bajo los procesos, plataformas e integraciones actuales.

La funcionalidad tampoco modifica la ponderación, prioridad comercial ni visibilidad de los negocios gratuitos. Los negocios administrados desde esta cuenta conservarán el mismo tratamiento que actualmente tienen los negocios gratuitos autogestionados dentro del portal.

---

# 5. Puntos de entrada

## 5.1 Registra tu empresa

Este será el único punto desde el cual un usuario nuevo podrá crear una cuenta gratuita.

El flujo actual de **Registra tu empresa** deberá modificarse lo menos posible.

El usuario deberá:

1. Entrar a **Registra tu empresa**.
2. Capturar los datos del negocio.
3. Finalizar el registro.
4. Asociar el negocio a un email mediante el flujo OTP existente.
5. Confirmar la creación o acceso a la cuenta gratuita.
6. Ver una pantalla de confirmación de registro/publicación.
7. Desde la confirmación, poder ir a **Mis Negocios**.

El primer negocio registrado desde este flujo se publicará inmediatamente, como ocurre actualmente, y contará como uno de los 3 negocios gratuitos publicados permitidos para la cuenta.

---

## 5.2 Mi Negocio

En la navegación principal del portal ya existe una sección llamada **Mi Negocio**, asociada actualmente a clientes que ya contrataron productos.

Desde esta sección se deberá presentar una bifurcación funcional con dos caminos:

### Ya soy cliente

Dirigido a clientes actuales que ya tienen productos contratados y usan las funcionalidades existentes de Mi Negocio.

### Cuenta gratuita

Dirigido a usuarios que ya crearon previamente una cuenta gratuita mediante **Registra tu empresa**.

Este camino permitirá únicamente iniciar sesión mediante el flujo OTP existente y acceder a **Mis Negocios**.

Desde **Mi Negocio > Cuenta gratuita** no se podrá crear una cuenta nueva. Si el email capturado no corresponde a una cuenta gratuita existente, no deberá completarse un acceso satisfactorio.

---

# 6. Acceso a cuenta gratuita

El acceso a la cuenta gratuita se realizará únicamente mediante **email**.

No se contempla contraseña.

Debe utilizarse el flujo OTP existente y previamente aprobado. El mock funcional no debe rediseñar el flujo OTP; únicamente debe representar los puntos donde se invoca y hacia dónde retorna el usuario después de una validación exitosa.

Escenarios principales:

## Desde Registra tu empresa

Después de capturar y finalizar el registro del negocio, el usuario captura su email.

* Si el email no existe, se crea la cuenta gratuita después de validar el OTP.
* Si el email ya existe, se valida el OTP y el nuevo negocio se asocia a esa cuenta existente.

## Desde Mi Negocio > Cuenta gratuita

El usuario captura su email, valida el OTP existente y, si la cuenta existe, accede a **Mis Negocios**.

---

# 7. Sección Mis Negocios

**Mis Negocios** será la sección privada donde el usuario podrá administrar los negocios gratuitos asociados a su cuenta.

La vista deberá mostrar una lista con los negocios de la cuenta, incluyendo como mínimo:

* Nombre del negocio.
* Estado.
* Categoría o giro.
* Población / ubicación.
* Acciones disponibles.

También deberá mostrar un contador visible de publicaciones gratuitas activas, por ejemplo:

> 2 de 3 negocios publicados

Este contador solo considerará negocios en estado **Publicado**.

Los negocios en estado **En Progreso** o **No publicado** no consumen espacios de publicación gratuita.

Los negocios eliminados lógicamente no deberán mostrarse en la interfaz.

---

# 8. Estados del negocio

La experiencia deberá contemplar tres estados visibles para el usuario:

## 8.1 En Progreso

Estado de un negocio cuya información fue guardada parcialmente, pero que aún no ha sido finalizado.

Características:

* No es visible públicamente en el portal.
* No aparece en resultados de búsqueda.
* No consume uno de los 3 espacios gratuitos de publicación.
* Puede editarse.
* Puede eliminarse.
* No puede verse en el portal público.

Este estado se genera cuando el usuario selecciona **Guardar avance** por primera vez durante la creación o edición de un negocio que aún no ha sido finalizado.

---

## 8.2 Publicado

Estado de un negocio visible públicamente en el portal.

Características:

* Aparece públicamente en el portal.
* Puede participar en resultados de búsqueda.
* Consume uno de los 3 espacios gratuitos de publicación de la cuenta.
* Puede editarse.
* Puede verse en el portal mediante una acción desde **Mis Negocios**.
* Puede cambiarse a **No publicado**.

---

## 8.3 No publicado

Estado de un negocio que ya existe en la cuenta, pero no está visible públicamente.

Características:

* No aparece públicamente en el portal.
* No participa en resultados de búsqueda.
* No consume espacio dentro del límite de 3 publicaciones gratuitas.
* Puede editarse.
* Puede publicarse si existe espacio disponible.
* Puede eliminarse lógicamente.

Este estado también aplica cuando un usuario finaliza un negocio, pero la cuenta ya tiene 3 negocios publicados.

---

# 9. Límite de publicación gratuita

Una cuenta gratuita podrá tener un máximo de **3 negocios publicados simultáneamente**.

No existe límite de negocios creados o guardados dentro de la cuenta.

Reglas:

* Una cuenta puede tener más de 3 negocios creados.
* Solo 3 pueden estar en estado **Publicado** al mismo tiempo.
* Los negocios adicionales podrán existir como **En Progreso** o **No publicado**.
* Si el usuario cambia un negocio publicado a **No publicado**, libera un espacio de publicación gratuita.
* Si hay espacio disponible, podrá publicar otro negocio.
* El primer negocio registrado desde **Registra tu empresa** se publica inmediatamente y consume uno de los 3 espacios.

---

# 10. Acciones disponibles por estado

## 10.1 Negocio En Progreso

Acciones disponibles:

* Continuar edición.
* Eliminar.

## 10.2 Negocio Publicado

Acciones disponibles:

* Editar.
* Ver en portal.
* Cambiar a No publicado.

## 10.3 Negocio No publicado

Acciones disponibles:

* Editar.
* Publicar.
* Eliminar.

La acción **Eliminar** no deberá estar disponible para negocios publicados. Para eliminar un negocio publicado, primero deberá cambiarse a **No publicado**.

---

# 11. Creación de negocios desde Mis Negocios

Una vez que el usuario ya tiene una cuenta gratuita y accede a **Mis Negocios**, podrá crear nuevos negocios desde esa sección.

El flujo deberá permitir:

1. Iniciar creación de nuevo negocio.
2. Capturar información en una sola vista.
3. Guardar avance.
4. Finalizar.

El negocio no deberá aparecer en la lista de **Mis Negocios** hasta que el usuario seleccione **Guardar avance** por primera vez.

Después del primer guardado, el negocio aparecerá en estado **En Progreso**.

---

# 12. Captura y edición de negocio

La captura y edición del negocio deberá resolverse en una sola vista funcional, no en un flujo dividido por pasos.

La vista deberá permitir capturar o modificar:

* Nombre del negocio.
* Categoría o giro.
* Dirección.
* Teléfono.
* WhatsApp.
* Sitio web.
* Correo electrónico.
* Horarios.
* Productos.
* Servicios.
* Marcas.
* Formas de pago.
* Descripción del negocio.
* Logotipo o imagen del negocio.

La vista deberá contar con dos acciones principales:

## Guardar avance

Permite guardar la información capturada sin finalizar el negocio.

Reglas:

* No requiere completar campos mínimos.
* Puede guardar información parcial.
* Si es un negocio nuevo, lo coloca en estado **En Progreso**.
* Si es un negocio publicado, no modifica la versión pública visible en el portal.

## Finalizar

Indica que el usuario terminó la captura o edición y que el negocio debe entrar al proceso de publicación o actualización.

Para finalizar, deberán ser obligatorios los siguientes datos mínimos:

* Nombre del negocio.
* Categoría o giro.
* Dirección.
* Teléfono.

Si falta alguno de estos datos, el portal deberá indicar qué información es necesaria para finalizar.

---

# 13. Comportamiento al editar negocios publicados

Cuando un negocio está en estado **Publicado** y el usuario entra a editarlo, la información pública actual debe mantenerse visible sin cambios mientras el usuario no seleccione **Finalizar**.

Si el usuario selecciona **Guardar avance**, los cambios quedan guardados como avance interno, pero no reemplazan la información visible públicamente.

Cuando el usuario selecciona **Finalizar**, los cambios se publican inmediatamente y reemplazan la información pública del negocio.

En esta fase no se contempla flujo de aprobación previa, validación automática o verificación documental antes de publicar cambios. La validación o verificación podrá considerarse en una fase futura.

---

# 14. Comportamiento al finalizar según estado

## Negocio En Progreso

Cuando el usuario selecciona **Finalizar**:

* Si la cuenta tiene menos de 3 negocios publicados, el negocio pasa a **Publicado**.
* Si la cuenta ya tiene 3 negocios publicados, el negocio pasa a **No publicado**.

## Negocio No publicado

Cuando el usuario selecciona **Finalizar**:

* Si hay espacio disponible, se publica inmediatamente.
* Si ya existen 3 negocios publicados, permanece como **No publicado**.

## Negocio Publicado

Cuando el usuario selecciona **Finalizar** después de editar:

* La información pública se actualiza inmediatamente.
* El negocio permanece en estado **Publicado**.

---

# 15. Cambiar negocio a No publicado

El usuario podrá cambiar un negocio de **Publicado** a **No publicado**.

Antes de aplicar el cambio, el portal deberá mostrar una confirmación indicando el impacto de la acción.

Mensaje funcional sugerido:

> Al cambiar este negocio a No publicado, dejará de estar visible en seccionamarilla.com y ya no aparecerá en resultados de búsqueda. Esta acción liberará un espacio dentro de tus 3 negocios gratuitos publicados.

Después de confirmar:

* El negocio deja de ser visible públicamente.
* Cambia a estado **No publicado**.
* Libera un espacio de publicación gratuita.
* Sigue disponible en **Mis Negocios** para edición, publicación futura o eliminación.

---

# 16. Publicar negocio No publicado

El usuario podrá publicar un negocio en estado **No publicado** si tiene espacio disponible dentro del límite de 3 negocios publicados.

Antes de publicar, el portal deberá mostrar una confirmación.

Mensaje funcional sugerido:

> Al publicar este negocio, será visible en seccionamarilla.com y ocupará uno de tus 3 espacios gratuitos disponibles.

Si hay espacio disponible:

* El negocio cambia a **Publicado**.
* Se vuelve visible en el portal.
* Consume un espacio gratuito.

Si no hay espacio disponible:

Mensaje funcional sugerido:

> No es posible publicar este negocio porque ya tienes 3 negocios publicados. Para publicar otro negocio, cambia alguno de tus negocios publicados a No publicado.

---

# 17. Eliminación lógica de negocio

El usuario solo podrá eliminar negocios en estado:

* **En Progreso**.
* **No publicado**.

No podrá eliminar directamente un negocio **Publicado**.

Para eliminar un negocio publicado, primero deberá cambiarlo a **No publicado**.

Antes de eliminar, el portal deberá mostrar una confirmación.

Mensaje funcional sugerido:

> Al eliminar este negocio, dejará de mostrarse en Mis Negocios y no podrás recuperarlo desde esta sección. ¿Deseas continuar?

Después de confirmar:

* El negocio desaparece de la interfaz de **Mis Negocios**.
* No podrá editarse ni republicarse desde la cuenta.
* Internamente, la eliminación será lógica y podrá conservarse información histórica para trazabilidad.

---

# 18. Confirmación posterior al registro desde Registra tu empresa

Después de que el usuario complete **Registra tu empresa**, valide su email mediante OTP y el negocio quede asociado a la cuenta gratuita, deberá mostrarse una pantalla de confirmación.

La confirmación deberá indicar que el negocio fue registrado y publicado correctamente.

Desde esta pantalla, el usuario podrá ir a **Mis Negocios**.

No deberá mostrarse en esta confirmación un enlace directo al negocio publicado.

El acceso para consultar la vista pública estará disponible desde **Mis Negocios**, mediante un botón tipo **Ver en portal**, únicamente para negocios en estado **Publicado**.

---

# 19. Mensajes funcionales clave

El mock deberá contemplar mensajes funcionales para los siguientes casos:

## Registro exitoso

> Tu negocio fue registrado y publicado correctamente.

## Negocio guardado como avance

> Tu avance fue guardado. Puedes continuar editando este negocio desde Mis Negocios.

## Campos mínimos faltantes al finalizar

> Para finalizar, completa la información requerida: nombre del negocio, categoría o giro, dirección y teléfono.

## Cambios finalizados en negocio publicado

> Los cambios fueron publicados correctamente.

## Límite de publicaciones alcanzado

> Ya tienes 3 negocios publicados. Puedes guardar este negocio, pero para publicarlo deberás cambiar alguno de tus negocios publicados a No publicado.

## Publicación exitosa

> Tu negocio fue publicado correctamente.

## Cambio a No publicado

> Tu negocio ahora está No publicado y ya no será visible en seccionamarilla.com.

## Confirmación para cambiar a No publicado

> Este negocio dejará de estar visible públicamente y liberará un espacio de publicación gratuita. ¿Deseas continuar?

## Confirmación para publicar

> Este negocio será visible en seccionamarilla.com y ocupará uno de tus espacios gratuitos disponibles. ¿Deseas continuar?

## Confirmación para eliminar

> Este negocio será eliminado de Mis Negocios y no podrás recuperarlo desde esta sección. ¿Deseas continuar?

---

# 20. Fuera de alcance de esta fase

No se contempla en esta primera fase:

* Administración de negocios pagados.
* Cambios al flujo actual de clientes en **Mi Negocio / Ya soy cliente**.
* Contratación de productos comerciales.
* Pagos en línea.
* Administración de contratos.
* Beneficios adicionales de visibilidad o ponderación.
* Reclamación de negocios existentes desde la ficha pública.
* Acción pública tipo “¿Este negocio es tuyo?”.
* Administración multiusuario de un mismo negocio.
* Invitación de colaboradores.
* Roles o permisos delegados.
* Cambio de email de la cuenta.
* Recuperación de contraseña, ya que no habrá contraseña.
* Rediseño del flujo OTP existente.
* Historial de cambios visible para el usuario.
* Métricas de visitas, clics, llamadas o WhatsApp.
* Previsualización del negocio antes de finalizar.
* Validación documental, verificación automática o aprobación previa antes de publicar cambios.
* Dashboard avanzado de administración.

---

# 21. Consideraciones para UX

El mock funcional deberá poner especial atención en que el usuario entienda claramente:

* Que **Registra tu empresa** es el único camino para crear una cuenta gratuita por primera vez.
* Que **Mi Negocio > Cuenta gratuita** es solo para usuarios que ya tienen cuenta.
* Que **Mis Negocios** administra únicamente negocios gratuitos.
* Que puede tener muchos negocios creados, pero solo 3 publicados al mismo tiempo.
* Que **Guardar avance** no publica ni actualiza información pública.
* Que **Finalizar** sí envía la información al proceso de publicación o actualización.
* Que cambiar a **No publicado** afecta la visibilidad pública del negocio.
* Que eliminar un negocio lo retira de la interfaz y no puede recuperarse desde la cuenta.
* Que los negocios publicados pueden verse desde **Mis Negocios** mediante el botón **Ver en portal**.

---

# 22. Resumen funcional ejecutivo

Se requiere incorporar una experiencia de **Mis Negocios** para cuentas gratuitas dentro de seccionamarilla.com.

Esta experiencia permitirá que los usuarios que registren negocios gratuitos desde **Registra tu empresa** puedan asociarlos a un email, acceder posteriormente mediante el flujo OTP existente y administrar sus negocios desde una sección privada.

Desde **Mis Negocios**, el usuario podrá crear nuevos negocios, guardar avances, finalizar información, publicar hasta 3 negocios gratuitos simultáneamente, cambiar negocios a No publicado, editar información y eliminar lógicamente negocios no publicados.

La funcionalidad deberá enfocarse en mejorar la autonomía del usuario y la calidad del contenido publicado, sin modificar el modelo comercial actual del portal ni interferir con los flujos existentes para clientes de productos pagados.
