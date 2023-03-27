import { useEffect, useState, ChangeEvent, useContext } from 'react';
import { IpcRendererEvent } from 'electron';
import { StepperContext } from '../../../projects/redux/stepper/stepperContext';
import { ProjectDataActionData } from '../../../projects/redux/stepper/actions/project-data-action';
import MenuItem from '@material-ui/core/MenuItem';
//import { Button } from '@material-ui/core';
import React from 'react';
import Menu from '@material-ui/core/Menu';
//import { AiOutlinePlusCircle } from 'react-icons/ai';
//import { IoIosArrowDropdown } from 'react-icons/io';
import Dropdown from 'react-dropdown';
import FormControl from '@material-ui/core/FormControl';

//import DevonInstancesService from '../../../../../main/services/devon-instances/devon-instances.service';

//import ReactDropdown from 'react-dropdown';
//import WhiteTextField from '../white-text-field/white-text-field';

interface InstancePath {
  ideConfig: {
    basepath: string;
  };
}

export default function DevonfwIdeSelector(
  props: React.HTMLAttributes<HTMLDivElement>
): JSX.Element {
  const [devonIdeInstances, setDevonIdeInstances] = useState<string[]>([]);
  const { state, dispatch } = useContext(StepperContext);
  const [anchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  // const directoryPath = path.join(process.cwd());
  //process.chdir(directoryPath);
  // console.log(__dirname);

  const selectInstance = (instance: string) => {
    dispatch(new ProjectDataActionData({ path: instance }));
    //console.log('show the instace element' + instance);
  };

  console.log(process.cwd(), 'rerendered');
 // console.log(global.ipcRenderer, 'show global ipc');
  useEffect(() => {
    console.log('GLOBALÜ ', global);
    console.log(global.ipcRenderer);
    if (global.ipcRenderer)
      global.ipcRenderer.send(
        'find:devonfWinstances',
        'show the messge in the console'
      );
    if (global.ipcRenderer) {
      global.ipcRenderer.on(
        'get:devoninstances',
        (_: IpcRendererEvent, instancesPath: InstancePath[]) => {
          if (instancesPath.length > 0) {
            const instances = instancesPath.map(
              ({ ideConfig }: InstancePath) => ideConfig.basepath
            );
            console.log(instances);
            setDevonIdeInstances(instances);
            selectInstance(instances[0]);
          }
        }
      );
    }
    return () => {
      if (global.ipcRenderer)
        global.ipcRenderer.removeAllListeners('get:devoninstances');
    };
  }, []);

  const handleChange = (event: ChangeEvent<{ value: string }>) => {
    const devonInstancesOpt = event.target.value;
    selectInstance(devonInstancesOpt);
  };

  /* useEffect(() => {
    console.log('INSTANCES CHANGEDÜ ', [devonIdeInstances]);
    if (global.ipcRenderer)
      global.ipcRenderer.send(
        'find:devonfWinstances',
        'show he renderer things'
      );
    console.log('GLOBALÜ ', global);
  }, []);*/

  return (
    // eslint-disable-next-line react/prop-types
    <FormControl className={props.className}>
      <div style={{ margin: '10px' }}>
        <Dropdown
          options={devonIdeInstances}
          placeholder="CHOOSE YOUR DEVONFW INSTANCE"
        >
          {devonIdeInstances.map((path) => (
            <Menu
              key={state.projectData.path}
              open={open}
              onClose={handleChange}
            >
              <MenuItem
                value={state.projectData.path}
                key={state.projectData.path}
              >
                {path}
              </MenuItem>

              <MenuItem>create a new Workspace</MenuItem>
            </Menu>
          ))}
        </Dropdown>
      </div>
    </FormControl>
  );
  {
    /*    <Button
          id="instance"
          variant="contained"
          endIcon={<IoIosArrowDropdown />}
          style={{ backgroundColor: 'white' }}
        >
          Choose an existing Instance
        </Button>
      <div>
        <Dropdown
          label="CHOOSE YOUR DEVONFW INSTANCE"
          //value={state.projectData.path}
          onChange={handleChange}
          variant="outlined"
        />

        {devonIdeInstances.map((path) => (
          <MenuItem key={path} value={path}>
            {path}
          </MenuItem>
        ))}
      </div>
    <React.Fragment>
   
      <div style={{ margin: '10px' }}>
    <Button
          id="create-workspace"
          variant="contained"
          onClick={handleClick}
          endIcon={<AiOutlinePlusCircle />}
          style={{ backgroundColor: 'white' }}
        >
          create a new Instance
          <input type="file" id="file" style={{ display: 'none' }} />
        </Button>
        <Menu
          MenuListProps={{
            'aria-labelledby': 'create-workspace',
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose} disableRipple>
            Edit
          </MenuItem>
          <MenuItem onClick={handleClose} disableRipple>
            Duplicate
          </MenuItem>
        </Menu>
      </div>
      

      <div style={{ margin: '10px' }}>
        <Button
          id="instance"
          variant="contained"
          onClick={handleClick}
          endIcon={<IoIosArrowDropdown />}
          style={{ backgroundColor: 'white' }}
        >
          Choose an existing Instance
        </Button>

        {devonIdeInstances.map((path) => (
          <Menu
            key={state.projectData.path}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClick}
          >
            <MenuItem onClick={handleClose}>tst to see if it works</MenuItem>
            <MenuItem key={path} value={path}>
              {path}
            </MenuItem>
            <MenuItem>create a new Workspace</MenuItem>
            <MenuItem>create a new Workspace</MenuItem>
          </Menu>
        ))}
      </div>
    </React.Fragment>
  );*/
  }
}
