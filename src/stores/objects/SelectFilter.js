import Filter from './Filter';
import { decorate, observable, action, computed } from 'mobx';
import { getSelectWhere } from '../../utils/Utils';

class SelectFilter extends Filter{
  type = 'select';
  loaded = false;
  options = [];
  selectValue = null;
  domainMap = new Map();

  load(featureLayer){
    super.load(featureLayer);
    const domain = featureLayer.getFieldDomain(this.field);
    if(domain){
      this.domainMap = domain.codedValues.reduce((p, cv) => {
        p.set(cv.code, cv.name);
        return p;
      }, new Map());
    }
    featureLayer.queryFeatures({
      where: "1=1",
      returnDistinctValues: true,
      outFields: [this.field]
    }).then(res => {
      this.options = res.features.map(f => 
        f.attributes[this.field]
      ).sort();
      this.loaded = true;
    });
  }

  onValueChange(v){
    if(this.selectValue === v){
      this.selectValue = null;
    } else {
      this.selectValue = v;
    }
  }

  clear(){
    this.selectValue = null;
  }

  get where(){
    return getSelectWhere(this.field, this.selectValue, this.fieldInfo.type);
  }

}

decorate(SelectFilter, {
  options: observable,
  loaded: observable,
  selectValue: observable,
  load: action.bound,
  where: computed,
  onValueChange: action.bound,
  clear: action.bound
})

export default SelectFilter;