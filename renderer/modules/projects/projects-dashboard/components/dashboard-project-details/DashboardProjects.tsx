import {
  useState,
  useEffect,
  ChangeEvent,
  useRef,
  MutableRefObject,
} from 'react';
import { IpcRendererEvent } from 'electron';
import { useDashboardProjectsStyles } from './dashboard-projects.styles';
import {
  ProjectDetails,
  SearchForm,
  ProjectDeleteUpdates,
} from '../../../redux/stepper/data.model';
import Renderer from '../../../../shared/services/renderer/renderer.service';
import { ProjectMenuType } from '../../../../../models/dashboard/ProjectMenuType';
import { AlertType } from '../../../../../models/alert/alert.model';
import { ProcessState } from '../../../../../models/dashboard/ProcessState';
import { DashboardSearch } from '../dashboard-search/dashboard-search';

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import NextLink from '../../../../shared/components/nextjs-link/NextLink';
import ProjectDetail from './project-detail';
import Alerts from '../../../../shared/components/alerts/alerts';
import ConfirmDialog from '../../../../shared/components/confirm-dialog/confirm.dialog';
import MenuList from '../menu-list/menu-list';
import NewProject from '../new-project/new-project';

interface DashboardProjectsProps {
  projects: ProjectDetails[];
  allProjects: ProjectDetails[];
  setProject: (searchForm: SearchForm, projects: ProjectDetails[]) => void;
  setAllProject: (project: ProjectDetails[]) => void;
  dirPath: string;
  projectsCount: number;
  workspaces: string[];
}

export default function DashboardProjects(
  props: DashboardProjectsProps
): JSX.Element {
  const renderer = new Renderer();
  const classes = useDashboardProjectsStyles({});
  const initialState = {
    mouseX: null,
    mouseY: null,
    project: { name: '', domain: '', date: '', path: '', workspace: 'main' },
  };
  const initialAlertState = {
    alertSeverity: '',
    message: '',
    operation: false,
  };
  const [open, setOpen] = useState(false);
  const [projectState, setProjectState] =
    useState<ProjectMenuType>(initialState);
  const [alertMessage, setAlertMessage] =
    useState<AlertType>(initialAlertState);
  const searchElement =
    useRef<HTMLInputElement>() as MutableRefObject<HTMLInputElement>;
  const filterElement =
    useRef<HTMLInputElement>() as MutableRefObject<HTMLInputElement>;
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const deleteConfimation = (value: boolean): void => {
    if (value === true) {
      deleteProject();
    }
    setOpenDialog(false);
  };

  const openDeleteProjectConfirmationDialog = () => {
    setOpenDialog(true);
  };

  const closeAlert = () => {
    setAlertMessage((prevState: AlertType) => {
      return {
        ...prevState,
        operation: false,
      };
    });
  };

  useEffect(() => {
    renderer.on('open:projectInIde', ideHandler);
    renderer.on('delete:project', deleteHandler);
    return () => {
      renderer.removeAll();
    };
  }, []);

  const handleClick = (
    event: React.MouseEvent<HTMLDivElement>,
    project: ProjectDetails
  ) => {
    event.preventDefault();
    setProjectState({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
      project: project,
    });
  };

  const ideHandler = (
    _: IpcRendererEvent,
    data: { data: ProcessState; message: string }
  ) => {
    setOpen(false);
    if (data.message !== 'success') {
      setAlertMessage({
        alertSeverity: 'error',
        message: data.message,
        operation: true,
      });
    }
  };

  const deleteHandler = (_: IpcRendererEvent, data: ProjectDeleteUpdates) => {
    setOpen(false);
    if (data.message === 'success') {
      props.setProject(getFilteredValue(), data.projects);
      props.setAllProject(data.projects);
      setAlertMessage({
        alertSeverity: 'success',
        message: 'Successfully deleted project',
        operation: true,
      });
    } else {
      setAlertMessage({
        alertSeverity: 'error',
        message: 'Failed to delete project',
        operation: true,
      });
    }
  };

  const handleClose = () => {
    setProjectState((prev) => {
      return {
        ...prev,
        mouseX: null,
        mouseY: null,
      };
    });
  };

  const openProjectInIde = (ide: string) => {
    setOpen(true);
    global.ipcRenderer.send('open:projectInIde', {
      project: projectState.project,
      ide: ide,
    });
    setProjectState(initialState);
  };

  const deleteProject = () => {
    setOpen(true);
    global.ipcRenderer.send('delete:project', {
      project: projectState.project,
      dirPath: props.dirPath,
    });
    setProjectState(initialState);
  };

  const openProjectDirectory = () => {
    global.ipcRenderer.send('open:directory', projectState.project.path);
  };

  const searchHandler = (event: ChangeEvent<HTMLInputElement>): void => {
    if (event.target.id !== 'search') {
      filterElement.current.value = event.target.value;
    }
    props.setProject(getFilteredValue(), props.allProjects);
  };

  const getFilteredValue = (): SearchForm => {
    return {
      searchValue: searchElement.current?.value,
      filterValue: filterElement.current.value,
    };
  };

  return (
    <div className={classes.root}>
      <DashboardSearch
        searchRef={searchElement}
        filterRef={filterElement}
        searchHandler={searchHandler}
        totalProjects={props.projectsCount}
      />
      <div className={classes.cardsContainer}>
        <NextLink
          href={props.dirPath ? '/projects/creation' : '#'}
          className={`${classes.link} ${
            !props.dirPath ? classes.disabled : ''
          }`}
        >
          <NewProject />
        </NextLink>
      </div>
      {props.workspaces &&
      props.workspaces.length &&
      searchElement.current.value
        ? props.workspaces.map((workspace) => (
            <div key={workspace} style={{ width: '100%' }}>
              {props.projects.filter(
                (project) => project.workspace === workspace
              ).length ? (
                <>
                  <h3>workspace {workspace}</h3>
                  <div className={classes.cardsContainer}>
                    {props.projects && props.projects.length
                      ? props.projects
                          .filter((project) => project.workspace === workspace)
                          .map((project) => (
                            <ProjectDetail
                              key={project.path}
                              project={project}
                              handleClick={handleClick}
                            />
                          ))
                      : null}
                  </div>
                </>
              ) : null}
            </div>
          ))
        : props.workspaces.map((workspace) => (
            <div key={workspace} style={{ width: '100%' }}>
              {props.projects.filter(
                (project) => project.workspace === workspace
              ).length ? (
                <>
                  <h3>workspace {workspace}</h3>
                  <div className={classes.cardsContainer}>
                    {props.projects && props.projects.length
                      ? props.projects
                          .filter((project) => project.workspace === workspace)
                          .map((project) => (
                            <ProjectDetail
                              key={project.path}
                              project={project}
                              handleClick={handleClick}
                            />
                          ))
                      : null}
                  </div>
                </>
              ) : (
                <>
                  <h3>workspace {workspace}</h3>
                  <div>
                    No projects in this workspace. Click Add New Project button
                    above to create a new project.
                  </div>
                </>
              )}
            </div>
          ))}
      <MenuList
        project={projectState.project}
        state={projectState}
        handleClose={handleClose}
        openProjectInIde={openProjectInIde}
        openProjectDirectory={openProjectDirectory}
        deleteProject={openDeleteProjectConfirmationDialog}
      />

      <Backdrop className={classes.backdrop} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Alerts
        close={closeAlert}
        alertSeverity={alertMessage.alertSeverity}
        message={alertMessage.message}
        operation={alertMessage.operation}
      />
      <ConfirmDialog
        title={'Confirmation'}
        content={`Are you sure do you want to delete the "${projectState.project.name}" project?`}
        openDialog={openDialog}
        onClose={deleteConfimation}
      ></ConfirmDialog>
    </div>
  );
}
