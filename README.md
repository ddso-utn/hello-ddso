# hello-ddso

Una herramienta de línea de comandos para validar la instalación de `git`, `node` y  `npm`. La herramienta genera un _token_ que servirá para identificarte.

## Requisitos

* Node.js >= 18

## Instalación

Cloná e instalá este repositorio localmente:

```bash
# clonar el repositorio
git clone https://github.com/ddso-utn/hello-ddso

# installar al proyecto, sus dependencias y
# hacer disponible al comando globalmente
cd hello-ddso
npm install
npm install -g .
```

Una vez instalado globalmente, el comando `hello-ddso` estará disponible en tu terminal.

## Comandos

### `generate` - Generar un JWT

Genera un JWT firmado que contiene los datos de estudiante  proporcionados, el sistema operativo detectado, y un hash SHA-256 de todos esos campos.

```bash
hello-ddso generate \
  --name Dani \
  --surname M \
  --student-id 123456-7 \
  --course K1234
```

#### Opciones

| Flag                  | Corto | Descripción                                                      | Requerido |
| --------------------- | ----- | ---------------------------------------------------------------- | --------- |
| `--name <n>`          | `-n`  | Nombre de estudiante                                             | ✅        |
| `--surname <surname>` | `-s`  | Apellido de estudiante                                           | ✅        |
| `--student-id <id>`   | `-i`  | Identificador de estudiante - debe seguir el formato `123456-7`  | ✅        |
| `--course <course>`   | `-c`  | Código del curso - debe seguir el formato `K1234` (ej. `K1234`)  | ✅        |
| `--no-confirm`        | `-y`  | Omitir la confirmación y generar directamente                    | ❌        |

Por defecto, la CLI mostrará todos los datos recopilados (incluyendo el sistema operativo detectada automáticamente) y pedirá confirmación antes de generar el token.

#### Omitir confirmación

```bash
hello-ddso generate -n Dani -s M -i 123456-7 -c K1234 --no-confirm
```

#### Ejemplo de salida

```
📋 Please review the data before generating the token:

   Name        : Dani
   Surname     : M
   Student ID  : 123456-7
   Course      : K1234
   OS          : linux
   Hash        : e3b0c44298fc1c149afb...

Generate token with this data? [y/n]: y

✅ Token generated successfully:

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### `verify` - Verificar un JWT

Verifica un token generado previamente. Comprueba que:

* La firma del JWT sea válida
* El token **no haya expirado** (validez de 1 hora)
* Todos los campos coincidan con el contenido del token
* El hash incluido coincida con el hash esperado recalculado a partir de los datos proporcionados

```bash
hello-ddso verify \
  --name Dani \
  --surname M \
  --student-id 123456-7 \
  --course K1234 \
  --os linux \
  --token <encoded-jwt>
```

#### Opciones

| Flag                  | Corto | Descripción                                                | Requerido |
| --------------------- | ----- | ---------------------------------------------------------- | --------- |
| `--name <n>`          | `-n`  | Nombre de estudiante                                       | ✅         |
| `--surname <surname>` | `-s`  | Apellido de estudiante                                     | ✅         |
| `--student-id <id>`   | `-i`  | Identificador de estudiante                                | ✅         |
| `--course <course>`   | `-c`  | Código del curso                                           | ✅         |
| `--os <os>`           |       | SO al momento de la generación (`windows`, `mac`, `linux`) | ✅         |
| `--token <token>`     | `-t`  | JWT codificado a verificar                                 | ✅         |

#### Ejemplo de salida (token válido)

```
✅ Token is valid!

   Name        : John
   Surname     : Doe
   Student ID  : 123456-7
   Course      : A1234
   OS          : linux
   Hash        : e3b0c44298fc1c149afb...
   Issued at   : 2026-03-28T10:00:00.000Z
   Expires at  : 2026-03-28T11:00:00.000Z
```

#### Ejemplo de salida (token expirado)

```
❌ Token has expired (max lifetime is 1 hour).
```

## Referencia de formato de entrada

| Campo         | Formato                                 | Ejemplo    |
| ------------- | --------------------------------------- | ---------- |
| ID Estudiante | `NNNNNN-N` (6 dígitos, guion, 1 dígito) | `123456-7` |
| Curso         | `K####` (1 letra mayúscula, 4 dígitos)  | `K1234`    |