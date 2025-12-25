import fs from 'fs'
import path from 'path'
import Ajv from 'ajv'

const ajv = new Ajv({ allErrors: true, strict: false })

function readJson(p){
  return JSON.parse(fs.readFileSync(p, 'utf-8'))
}

function validateArray(name, arraySchema, data){
  const validate = ajv.compile(arraySchema)
  const ok = validate(data)
  if(!ok){
    const errors = validate.errors || []
    const msg = ajv.errorsText(errors)
    throw new Error(`${name} validation failed: ${msg}`)
  }
}

function main(){
  const root = process.cwd()
  const schemaPost = readJson(path.join(root, 'src/data/schemas/post.schema.json'))
  const schemaProject = readJson(path.join(root, 'src/data/schemas/project.schema.json'))

  const posts = readJson(path.join(root, 'public/data/posts.json'))
  const projects = readJson(path.join(root, 'public/data/projects.json'))

  validateArray('posts.json', schemaPost, posts)
  validateArray('projects.json', schemaProject, projects)

  console.log('✅ Data validation passed: posts.json and projects.json')
}

try {
  main()
} catch (err){
  console.error('❌', err.message)
  process.exit(1)
}
