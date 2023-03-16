import type {MaterialAppHeaderAction} from '../MaterialAppHeaderAction/typings';

declare namespace MaterialAppHeaderBackAction {
  type Props = Omit<
    MaterialAppHeaderAction.Props,
    'icon' | 'initAnimation' | 'useIconFont'
  >;
}
