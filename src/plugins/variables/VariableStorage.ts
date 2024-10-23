import { ConstantVariable } from "@/plugins/variables/ConstantVariable";
import { ComputedVariable } from "@/plugins/variables/ComputedVariable";
import { QueryVariable } from "@/plugins/variables/QueryVariable";
import { RequestVariable } from "@/plugins/variables/RequestVariable";
import { TimeVariable } from "./TimeVariable";

export class VariableStorage {
  private variables: { [key: string]: any } = {};

  createVariable(type: string, name: string, config: INewVariableConfig) {
    console.log(type, name, config);

    if (type === 'constant') {
      const variable = new ConstantVariable(name, this, config as IConstantVariableConfig);
      this.variables[name] = variable;
    }

    if (type === 'computed') {
      const variable = new ComputedVariable(name, this, config as IComputedVariableConfig);
      this.variables[name] = variable;
    }

    if (type === 'query') {
      const variable = new QueryVariable(name, this, config as IQueryVariableConfig);
      this.variables[name] = variable;
    }

    if (type === 'request') {
      console.log('creating request variable');
      const variable = new RequestVariable(name, this, config as IRequestVaribleConfig);
      this.variables[name] = variable;
    }

    if (type === 'time') {
      const variable = new TimeVariable(name, this, config as IConstantVariableConfig);
      this.variables[name] = variable;
    }

    return this.variables[name];
  }

  removeVariable(name: string) {
    delete this.variables[name];
  }

  getVariable(name: string) {
    return this.variables[name];
  }
}